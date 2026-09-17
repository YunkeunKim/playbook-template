// 또래 인기 도서 추천 화면이 생기기 전까지 쓰는 임시 자료다.
// 추천 화면이 붙으면 이 파일과 이를 쓰는 「데모 책 담기」를 지운다.
// isbn13은 실제 번호를 지어내지 않고 DEMO- 접두사를 붙여, 진짜 데이터가
// 들어와도 섞이지 않고 나중에 골라 지울 수 있게 했다.

export type DemoBook = {
  isbn13: string;
  title: string;
  authors: string;
  publisher: string;
  publication_year: string;
  class_no: string;
};

export const DEMO_BOOKS: DemoBook[] = [
  {
    isbn13: "DEMO-001",
    title: "아몬드",
    authors: "손원평 지음",
    publisher: "창비",
    publication_year: "2017",
    class_no: "813",
  },
  {
    isbn13: "DEMO-002",
    title: "소년이 온다",
    authors: "한강 지음",
    publisher: "창비",
    publication_year: "2014",
    class_no: "813",
  },
  {
    isbn13: "DEMO-003",
    title: "수레바퀴 아래서",
    authors: "헤르만 헤세 지음 ; 김이섭 옮김",
    publisher: "민음사",
    publication_year: "2001",
    class_no: "853",
  },
  {
    isbn13: "DEMO-004",
    title: "모모",
    authors: "미하엘 엔데 지음 ; 한미희 옮김",
    publisher: "비룡소",
    publication_year: "1999",
    class_no: "853",
  },
  {
    isbn13: "DEMO-005",
    title: "코스모스",
    authors: "칼 세이건 지음 ; 홍승수 옮김",
    publisher: "사이언스북스",
    publication_year: "2006",
    class_no: "440",
  },
  {
    isbn13: "DEMO-006",
    title: "이기적 유전자",
    authors: "리처드 도킨스 지음 ; 홍영남 옮김",
    publisher: "을유문화사",
    publication_year: "2018",
    class_no: "470",
  },
  {
    isbn13: "DEMO-007",
    title: "나의 문화유산답사기 1",
    authors: "유홍준 지음",
    publisher: "창비",
    publication_year: "2011",
    class_no: "911",
  },
  {
    isbn13: "DEMO-008",
    title: "어린 왕자",
    authors: "앙투안 드 생텍쥐페리 지음 ; 김화영 옮김",
    publisher: "문학동네",
    publication_year: "2007",
    class_no: "863",
  },
];
