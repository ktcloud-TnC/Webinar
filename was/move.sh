#!/bin/bash

mkdir -p /root/go/src/project01

mv /root/webinar/was/project01 /root/go/src/

mv /root/webinar/was/myapp.service /etc/systemd/system/

echo "실습파일 재배치가 완료 되었습니다."
