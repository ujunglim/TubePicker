@echo off
echo ===== Starting Deployment =====

@REM ssh login, execute
set KEY="C:\Users\Yujung\Documents\TubePicker\aws_key_pair.pem"
set HOST=ubuntu@ec2-43-203-78-29.ap-northeast-2.compute.amazonaws.com
@REM copy .env
scp -i %KEY% ./.env %HOST%:TubePicker/Server

echo ===== Starting Build =====
@REM build client and copy 
cd ../Client
call npm run build
echo ===== Starting Copy the Build to Ubuntu =====
@REM scp -i %KEY% -r ../Client/build %HOST%:TubePicker/Client
scp -i %KEY% -r ../Client/build %HOST%:TubePicker/Client


echo ===== Starting SSH Access =====
ssh -i %KEY% %HOST% -t "cd TubePicker; git fetch --all; git reset --hard origin/master; cd Server ; bash --login -i run.sh"

echo ===== Finished Deployment =====
