const modal = document.getElementById("movie-modal");
const modal_cancel_btn = document.getElementById("movie-modal-cancel-btn");

export function openModal(event) {
    const modal_image = document.getElementById("movie-modal-image");
    const modal_title = document.getElementById("movie-modal-title-text");
    const modal_grade = document.getElementById("movie-modal-grade-text");
    const modal_release_date = document.getElementById("movie-modal-release-date-text");
    const modal_overview = document.getElementById("movie-modal-overview-text");

    modal.setAttribute("class", "po-fixed dp-block");
    if (!window.location.href.includes("#modal")) {
        history.pushState(null, null, location.pathname + "#modal");
    }

    modal_image.src = event.target.currentSrc;
    let second_divs = event.target.nextElementSibling.children;
    modal_title.innerText = second_divs[0].children[0].innerText;
    modal_grade.innerText = second_divs[1].children[0].innerText;
    modal_release_date.innerText = second_divs[2].children[0].innerText;
    modal_overview.innerText = second_divs[3].children[0].innerText;
}

//modal을 닫는 함수
function closeModal() {
    modal.setAttribute("class", "po-fixed dp-none");
    history.back();
}

modal_cancel_btn.addEventListener("click", closeModal);

window.addEventListener("popstate", () => {
    if (location.hash === "#modal") {
        modal.setAttribute("class", "po-fixed dp-block");
    } else {
        modal.setAttribute("class", "po-fixed dp-none");
    }
});
