# 🍒TubePicker

추천기능없이 내가 원하는 영상만 모아서 볼 수 있는 서비스를 만들고 싶어서 시작했다.

```
npm start
node app.ts
```

### 기능목록

- [x] 유튜브 특정채널의 동영상 리스트 가져오기

  - [x] API key받아 연결하기
  - [x] 비디오데이터 로컬에 저장하기
  - [] 에러발생 예외처리
  - [x] less 설정하기
  - [x] 폰트

- 레이아웃

  - [x] Home
  - [x] main 비디오리스트
  - [x] 반응형 처리
  - [x] header, sider 고정
  - [x] header 홈 버튼
  - [x] 디폴트 레이아웃 안에 routes 넣기

- Google OAuth

  - [x] 구글 클라우드에서 OAuth동의화면, 사용자 인증정보 설정하기
  - [x] 서버 만들기
  - [x] 렌딩 페이지 로그인 구현
  - [x] 헤더 로그아웃 구현
  - [x] localStorage login info 저장

- 영상 보기
  - [x] 영상 클릭시 라우터 전환
  - [] Watch video 페이지
