document.getElementById("imageUpload").onclick = function () {
    let xhttp = new XMLHttpRequest(); // create new AJAX request

    const selectedImage = document.getElementById("selectedImage");
    const imageStatus = document.getElementById("imageStatus");

    xhttp.onreadystatechange = function () {
        imageStatus.innerHTML = this.responseText;
    };

    xhttp.open("POST", "/dashboard/image-upload");
    let formData = new FormData();

    if (selectedImage.files.length > 0) {
        formData.append("image", selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
    }
};
