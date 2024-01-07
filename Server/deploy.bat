@echo off
echo ===== Starting Deployment... =====

@REM ssh login, execute
set KEY="C:\Users\Yujung\Documents\TubePicker\aws_key_pair.pem"
set HOST=ubuntu@ec2-43-203-78-29.ap-northeast-2.compute.amazonaws.com
ssh -i %KEY% %HOST% -t "cd TubePicker; git reset --hard origin/master; bash /Server/run.sh"

echo ===== Finished Deployment =====
