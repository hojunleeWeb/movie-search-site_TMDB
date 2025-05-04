import API_KEY from "../apikey.js";

let url_options = "with_watch_providers=337";
//const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${url_options}&watch_region=KR&language=ko&page=1`;

//https://api.themoviedb.org/3/discover/movie?api_key=80b069d7bb5cb34cf8fdc4be5a095d5b&with_watch_providers=337&watch_region=KR&language=ko&page=1
//영화 데이터 column 정리
//adult : 성인 or 비성인
//backdrop_path, poster_path : 영화 사진 및 포스터 사진
//전체 사진 링크 : https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg // w500은 사진크기
//id : 영화 아이디
//overview : 간단 소개
//title : 영화 제목
//genre_ids : 해당 영화의 장르를 id별로 표기 -> 해당 id가 어떤 장르를 의미하는 지는 찾아봐야함
//vote_average : 평균 평점
//vote_count : 평점을 매긴 사람 수
//page 당 영화 숫자는 20개

export async function loadData(query) {
    try {
        let url;
        if (query != null) {
            //query가 null일때 아닐때로 검색과 기본 ui 구현을 분리
            url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&&watch_region=KR&language=ko&page=1`;
        } else {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${url_options}&watch_region=KR&language=ko&page=1`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("영화 데이터를 불러오는 중 오류 발생:", error);
        return null;
    }
}
//fetch를 사용해서 url로 접속해 json 파일을 얻어내는 과정에서 많은 시행착오를 겪었다.
// -> fetch 함수를 사용할 때 then() 함수는 해당 fetch가
//성공했을 대
