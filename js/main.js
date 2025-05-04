import { loadData } from "./get_movies.js";
import { openModal } from "./modal.js";

let backdrop_images;
let titles;
let grades;
let release_dates;
let overviews;

const container = document.getElementById("movie-container");
const modal = document.getElementById("movie-modal");
const modal_cancel_btn = document.getElementById("movie-modal-cancel-btn");
const search_input = document.getElementById("movie-search");
const search_btn = document.getElementById("movie-search-btn");

window.onload = function () {
    // 초기 데이터 로딩
    loadAndDisplayMovies();
};
//get요청을 받은 data를 가지고 모든 ui를 채우자
function loadAndDisplayMovies(query) {
    loadData(query).then((data) => {
        if (data) {
            CreateBasicDomTree(data.results.length); // 데이터 개수에 맞춰 DOM 생성
            UiUpdateBasedGetJsonData(data);
        } else {
            console.error("영화 데이터를 불러오는 데 실패했습니다.");
        }
    });
}

//기본적이 돔트리를 구성
function CreateBasicDomTree(count = 20) {
    let movie_container = document.getElementById("movie-container");
    movie_container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const html = `<div class="movie-item flex-item bg-gray margin-10">
                    <img class="movie-image" src="" alt="" />
                    <div class="movie-second-div dp-column-flex margin-left-20">
                        <div class="movie-title text-color-white">
                            제목 :<span class="movie-title-text margin-10 text-color-white"></span>
                        </div>
                        <div class="movie-grade text-color-white">
                            평점 :<span class="movie-grade-text margin-10 text-color-white"></span>
                        </div>
                        <div class="movie-release-date text-color-white">
                            출시일 :<span class="movie-release-date-text margin-10 text-color-white"></span>
                        </div>
                        <div class="movie-overview dp-none">
                            줄거리 :<span class="movie-overview-text margin-10"></span>
                        </div>
                    </div>
                </div>`;
        movie_container.innerHTML += html;
    }
    // DOM이 생성된 후에 HTMLCollection 업데이트
    backdrop_images = document.getElementsByClassName("movie-image");
    titles = document.getElementsByClassName("movie-title-text");
    grades = document.getElementsByClassName("movie-grade-text");
    release_dates = document.getElementsByClassName("movie-release-date-text");
    overviews = document.getElementsByClassName("movie-overview-text");
}

// 영화 제목, overview, 사진 등을 이용한 flex-item 채우기
function UiUpdateBasedGetJsonData(data) {
    if (data && data.results) {
        let json_backdrop_path = data.results.map((item) => item["backdrop_path"]);
        let json_title = data.results.map((item) => item["title"]);
        let json_grade = data.results.map((item) => item["vote_average"]);
        let json_release_date = data.results.map((item) => item["release_date"]);
        let json_overview = data.results.map((item) => item["overview"]);
        HTMLcollectionTextUpdate(titles, json_title);
        HTMLcollectionTextUpdate(overviews, json_overview);
        HTMLcollectionTextUpdate(grades, json_grade);
        HTMLcollectionTextUpdate(release_dates, json_release_date);
        HTMLcollectionImageUpdate(backdrop_images, json_backdrop_path, 300);
    } else {
        console.log("데이터를 로드하지 못했습니다.");
    }
}

function HTMLcollectionTextUpdate(htmlcollections, text_arr) {
    for (let i = 0; i < htmlcollections.length; i++) {
        htmlcollections[i].innerText = text_arr[i]; // innerHTML 대신 innerText 사용
    }
}
function HTMLcollectionImageUpdate(htmlcollections, image_url_arr, size) {
    let url = "https://image.tmdb.org/t/p/w";
    for (let i = 0; i < htmlcollections.length; i++) {
        if (htmlcollections[i]) {
            htmlcollections[i].src = url + size + image_url_arr[i];
        }
    }
}

//검색 버튼 클릭 이벤트
search_btn.addEventListener("click", () => {
    const searchTerm = search_input.value.trim();
    search_input.value = "";
    if (searchTerm) {
        loadAndDisplayMovies(searchTerm);
    } else {
        // 검색어가 없을 경우 기본 데이터 표시
        loadAndDisplayMovies();
    }
});
search_btn.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        search_btn.click(); // 검색 버튼 클릭 이벤트 강제 발생
    }
});

//외부 modal.js를 이용해 클릭한 image의 정보를 바탕으로 modal을 채우자
//이벤트 위임을 적용하기 위해 target의 속성일 깊이 탐색해서 image 태그를 찾자
//이미지 클릭 이벤트
container.addEventListener("click", function (event) {
    if (event.target.classList.contains("movie-image")) {
        openModal(event);
    }
});
