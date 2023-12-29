// 모듈에서 내보낸 객체의 타입을 지정합니다.
// 해당 모듈에 대한 타입 정보를 정의합니다.
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}