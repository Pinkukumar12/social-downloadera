document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const input = document.querySelector("input[name='url']");
    const button = document.querySelector("button");

    form.addEventListener("submit", function () {
        if (input.value.trim() === "") {
            alert("Please enter a video URL!");
            return false;
        }
        button.innerText = "Processing...";
        button.disabled = true;
    });
});
