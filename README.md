# :pushpin: Desktop_Chatting
데스크탑 유저를 위한 채팅 프로그램

## 1. 실행 방법
- 다음을 순서대로 실행해주세요
<pre>
 # 1. git clone [깃헙 저장소 주소]
 $ git clone git@github.com:han-byul-yang/Desktop_Chatting.git
 
 # 2. 클론받은 폴더로 이동
 $ cd Desktop_Chatting(폴더를 특별히 지정하지 않은 경우)
 
 # 3. 폴더 파일 열기
 $ code .
 
 # 4. dev dependencies를 설치
 $ npm install 또는 npm i
 
 # 5. 서버 실행(http://localhost:8888)
 $ npm run dev

</pre>

## 2. 사용 기술
  - React v18
  - Typescript
  - Firebase

## 3. 기능 구현
- [x] 로그인
  <pre>테스트 유저(이메일/비밀번호)
  - 11@naver.com/user11
  - 22@naver.com/user22
  - 33@naver.com/user33
  </pre> 
- [x] 회원가입
- [x] 유저 목록
- [x] 1대1 채팅
- [x] 그룹 채팅

## 4. 화면 
### 4.1 로그인
- 로그인 오류 발생 시 오류 모달을 띄워줍니다.
![image](https://user-images.githubusercontent.com/67466789/217676715-f56254b1-d808-4e82-b16c-44a5d1c181ce.png)
![image](https://user-images.githubusercontent.com/67466789/217891542-a694a2a2-1ebc-4f77-80bd-6ac2b608ba35.png)

###  4.2 회원가입
- 회원가입 오류 발생 시 오류 모달을 띄워줍니다.
![image](https://user-images.githubusercontent.com/67466789/217676835-acc73bfe-8a9e-49a1-8f4f-5ee1d709647c.png)


### 4.3 유저 목록
- 회원가입한 유저가 목록에 모두 보여집니다. 
- 유저를 클릭하면 닉네임 및 이메일 정보가 띄워집니다.

![image](https://user-images.githubusercontent.com/67466789/217676248-a805124b-8fe1-49af-a862-226172365da3.png)
![image](https://user-images.githubusercontent.com/67466789/217676501-20e776f0-c747-41c4-a004-6ffb9b9de97e.png)


### 4.4 채팅 목록
- 기존의 채팅방 목록으로, 방 클릭 시 채팅할 수 있습니다.
- <b>채팅방 이름이 유저(나)를 제외한 멤버로 나열</b> 표시됩니다. 유저(나)의 채팅방은 '내 채팅방'으로 표시됩니다.
- <b>채팅방 생성 시 실시간으로 목록 상단에 표시</b>됩니다. 
- 마지막 메세지가 <b>가장 최신인 순으로 채팅방이 실시간 나열 및 표시</b>됩니다. 

![image](https://user-images.githubusercontent.com/67466789/217679308-0c73753f-fbba-4801-b3ea-63bad5a2550f.png)


### 4.5 채팅방
- 선택한 멤버들의 <b>채팅방이 이미 존재하는 경우</b> 그 <b>기존의 채팅방</b>을 띄워줍니다.
- 멤버들이 모두 속한 <b>채팅방이 없는 경우</b> <b>새로운 채팅방</b>을 띄워줍니다. 
- Enter를 누르면 메세지가 전송되며, Enter+Shift를 누르면 줄바꿈을 할 수 있습니다.
- 이전 메세지 전송 이후 날짜가 변경되면, 새로운 메세지 표시 전에 날짜가 띄워집니다.
- 연속으로 같은 멤버가 메세지를 보내면, 뒤 메세지의 닉네임은 표시가 생략됩니다.
- 연속으로 같은 시&분에 메세지를 보내면, 앞의 시간은 표시가 생략됩니다. 
- 채팅방 클릭 시, **스크롤 마지막 위치의 화면**이 띄워집니다. 

#### 4.5.1 1대1 채팅
- **유저 목록 페이지의 유저를 클릭**하거나, **채팅방 페이지의 채팅 상대 선택 버튼 클릭 후, 상대를 선택**하여 채팅을 시작할 수 있습니다.
- 이 때, 아무도 클릭하지 않는 경우 방 생성 버튼이 <b>비활성화</b> 됩니다. 

![image](https://user-images.githubusercontent.com/67466789/217678391-9f886f82-5f1e-4bd6-bad9-ea8f2932b3f8.png)

[유저 선택]

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/67466789/217677847-9b9c9779-4058-4ea8-99c4-d2058fa81957.gif)

[1대1 채팅]

![ezgif com-gif-maker (12)](https://user-images.githubusercontent.com/67466789/217680247-fa9325c8-cc5f-41a0-bea2-50e63f81e3ff.gif)


#### 4.5.2 그룹 채팅
- **채팅방 페이지의 채팅 상대 선택 버튼 클릭 후, 멤버들을 선택**하여 채팅을 시작할 수 있습니다. 
- 이 때, 아무도 클릭하지 않는 경우 방 생성 버튼이 <b>비활성화</b> 됩니다. 

![image](https://user-images.githubusercontent.com/67466789/217679187-418bae7e-7072-4471-89b7-6573dbe6e012.png)

[유저 선택]

![ezgif com-video-to-gif (2)](https://user-images.githubusercontent.com/67466789/217679702-d20fc1f7-6dad-443a-b705-0dd3c5cff911.gif)

[그룹 채팅]

![ezgif com-gif-maker (13)](https://user-images.githubusercontent.com/67466789/217681335-0354ac54-6411-46db-b52a-1deec8b80adb.gif)


#### 4.5.3 내 채팅
- 유저 목록의 내 프로필을 클릭하면 **내 채팅방**을 시작할 수 있습니다.

![image](https://user-images.githubusercontent.com/67466789/217677145-94e56446-080b-45fe-a74f-9237c406c76d.png)
 
