function calcTimeDiff(publishedDate: string) {
  const now: any = new Date();
  const past: any = new Date(publishedDate);
  const timestampDiff = now - past;
  
  // 1일 미만
  if (timestampDiff < 86400000) return `${Math.floor(timestampDiff / 3600000)} 시간 전`
  // 1주 미만
  else if (timestampDiff < 604800000) return `${Math.floor(timestampDiff / 86400000)} 일 전`
  // 한 달 미만
  else if (timestampDiff < 2592000000) return `${Math.floor(timestampDiff / 604800000)} 주 전`
  // 1년 미만
  else if (timestampDiff < 31536000000) return `${Math.floor(timestampDiff / 2592000000)} 달 전`
  else return `${Math.floor(timestampDiff / 31536000000)} 년 전`
}

export default calcTimeDiff;