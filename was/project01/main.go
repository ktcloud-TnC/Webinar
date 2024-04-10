package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // allow all origins
	},
}

var (
	logDirExists bool
	logFilePath  = "/waslog/app.log"
)

func main() {
	e := echo.New()

	// 한국 시간대(KST) 설정
	location, err := time.LoadLocation("Asia/Seoul")
	if err != nil {
		e.Logger.Fatal(err)
	}

	// middleware settings
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// static file service
	e.Static("/", "static")

	// 상품 리스트 엔드포인트 등록
	e.GET("/api/products/list", getProductList)

	// 상품 설명 엔드포인트 등록
	e.GET("/api/products/description/:id", getProductDescription)

	e.POST("/api/products/add", addProduct)

	// Define logFile variable
	var logFile *os.File

	// Check if the log directory exists
	logDir := filepath.Dir(logFilePath)
	if _, err = os.Stat(logDir); os.IsNotExist(err) {
		logDirExists = false
		log.SetOutput(os.Stderr)
	} else {
		logDirExists = true
		// If the directory exists, open or create the log file
		logFile, err = os.OpenFile(logFilePath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
		if err != nil {
			log.Fatalf("error opening or creating file: %v", err)
		}
		defer logFile.Close()
		// Set the log output to the log file
		log.SetOutput(logFile)
	}

	// Log middleware settings
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Skipper: func(c echo.Context) bool {
			// '/api/was-server-status'에 대한 요청은 로그를 기록하지 않음
			if c.Path() == "/api/was-server-status" {
				return true
			}
			return false
		},
		Format: `${time_custom} | remote_ip:"${remote_ip}" | method:"${method}"` + "\n" +
			`| uri: "${uri}" | status: ${status} | referer: "${referer}" |` +
			` user_agent: "${user_agent}" | response_time: "${latency_human}" | bytes_in: ${bytes_in} | bytes_out: ${bytes_out}` + "\n",
		CustomTimeFormat: "2006-01-02 15:04:05", // Go의 시간 포맷
		Output:           logFile,
	}))

	// Custom middleware to apply custom time format
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			now := time.Now().In(location)
			c.Set("custom_time", now.Format("2006-01-02 15:04:05"))
			return next(c)
		}
	})

	// websocket endpoint
	e.GET("/api/ws", handleWebSocket)

	// health check endpoint
	e.GET("/healthCheck", func(c echo.Context) error {
		return c.String(http.StatusOK, "Echo application is running")
	})

	// DB connection check endpoint
	e.GET("/dbCheck", checkDBConnection)

	// Server status check endpoint
	e.GET("/api/was-server-status", func(c echo.Context) error {
		cpuUsage, err := getCPUUsage()
		if err != nil {
			return err
		}
		memoryUsage, err := getMemoryUsage()
		if err != nil {
			return err
		}

		// 호스트 이름을 가져옵니다.
		hostname, err := os.Hostname()
		if err != nil {
			log.Printf("Error getting hostname: %v", err)
			return err
		}

		status := ServerStatus{
			CPUUsage:    cpuUsage,
			MemoryUsage: memoryUsage,
			Hostname:    hostname, // 호스트 이름을 상태에 추가합니다.
		}
		return c.JSON(http.StatusOK, status)
	})

	// start server
	e.Logger.Fatal(e.Start(":80"))
}

func init() {
	// .env 파일에서 환경 변수 로드
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func ConnectDB() (*sql.DB, error) {
	dbServerIP := os.Getenv("DB_SERVER_IP")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	// 환경 변수를 사용하여 커넥션 스트링 구성
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8", dbUser, dbPassword, dbServerIP, dbPort, dbName)
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Printf("Error opening DB: %v", err)
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		log.Printf("Error pinging DB: %v", err)
		return nil, err
	}

	return db, nil
}

// ServerStatus is a structure that represents the status of the server.
type ServerStatus struct {
	Hostname    string  `json:"hostname"` // 호스트 이름 필드 추가
	CPUUsage    float64 `json:"cpuUsage"`
	MemoryUsage float64 `json:"memoryUsage"`
}

// getCPUUsage calculates and returns CPU usage.
func getCPUUsage() (float64, error) {
	percentages, err := cpu.Percent(time.Second, false)
	if err != nil {
		return 0, err
	}
	return percentages[0], nil // Returns the utilization of the first CPU
}

// getMemoryUsage calculates and returns memory usage.
func getMemoryUsage() (float64, error) {
	v, err := mem.VirtualMemory()
	if err != nil {
		return 0, err
	}
	return v.UsedPercent, nil // returns percentage of memory in use
}

// DB connection check function
func checkDBConnection(c echo.Context) error {
	db, err := ConnectDB()
	if err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "Unable to connect to DB server.")
	}
	defer db.Close()

	return c.String(http.StatusOK, "DB server connection is successful.")
}

// websocket handler
func handleWebSocket(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v", err)
		return err
	}
	defer ws.Close()

	// 로그 디렉토리가 존재하지 않으면 에러 메시지 전송
	if !logDirExists {
		msg := "로그 디렉토리가 존재하지 않습니다."
		ws.WriteMessage(websocket.TextMessage, []byte(msg))
		return nil
	}

	// 로그 디렉토리가 존재하면 지속적으로 로그 파일을 읽고 전송
	for {
		data, err := readLogFile(logFilePath)
		if err != nil {
			log.Printf("Error reading log file: %v", err)
			continue // 로그 파일 읽기 오류 발생 시 계속 시도
		}

		if err := sendWebSocketMessage(ws, data); err != nil {
			log.Printf("Error sending WebSocket message: %v", err)
			break // 메시지 전송 오류 발생 시 중단
		}

		time.Sleep(1 * time.Second) // 1초 대기
	}

	return nil
}

// file read function
func readLogFile(filePath string) ([]byte, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Printf("Error reading log file: %v", err)
		return nil, err
	}
	return data, nil
}

// WebSocket message transmission function
func sendWebSocketMessage(ws *websocket.Conn, data []byte) error {
	err := ws.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Printf("Error sending message: %v", err)
		return err
	}
	return nil
}

// 상품 리스트를 반환하는 핸들러 함수
func getProductList(c echo.Context) error {
	db, err := ConnectDB()
	if err != nil {
		log.Println("Database connection error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database connection error"})
	}
	defer db.Close()

	// 상품 목록 및 카테고리 조회 쿼리 실행
	rows, err := db.Query("SELECT id, name, description, category FROM products")
	if err != nil {
		log.Println("Query execution error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Query execution error"})
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var id int
		var name, description, category string
		if err := rows.Scan(&id, &name, &description, &category); err != nil {
			log.Println("Rows scanning error:", err)
			continue
		}
		products = append(products, map[string]interface{}{
			"id":          id,
			"name":        name,
			"description": description,
			"category":    category, // 카테고리 정보 추가
		})
	}

	return c.JSON(http.StatusOK, products)
}

// 특정 상품의 설명을 반환하는 핸들러 함수
func getProductDescription(c echo.Context) error {
	id := c.Param("id")

	db, err := ConnectDB()
	if err != nil {
		log.Println("Database connection error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database connection error"})
	}
	defer db.Close()

	// 특정 상품의 설명 조회 쿼리 실행
	var description string
	err = db.QueryRow("SELECT description FROM products WHERE id = ?", id).Scan(&description)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
		}
		log.Println("QueryRow execution error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "QueryRow execution error"})
	}

	return c.JSON(http.StatusOK, map[string]string{"description": description})
}

// Handler function that adds a new product
func addProduct(c echo.Context) error {
	// 상품 정보를 담을 구조체 정의
	type Product struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Category    string `json:"category"`
	}

	var newProduct Product
	// 요청 본문에서 상품 정보를 읽어옴
	if err := c.Bind(&newProduct); err != nil {
		return err
	}

	db, err := ConnectDB()
	if err != nil {
		log.Println("Database connection error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database connection error"})
	}
	defer db.Close()

	// 상품 정보를 데이터베이스에 추가하는 SQL 쿼리 실행
	_, err = db.Exec("INSERT INTO products (name, description, category) VALUES (?, ?, ?)", newProduct.Name, newProduct.Description, newProduct.Category)
	if err != nil {
		log.Println("Insert query execution error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to add product"})
	}

	return c.JSON(http.StatusCreated, newProduct)
}
