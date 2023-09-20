document.getElementById("imageUpload").onclick = function () {
    let xhttp = new XMLHttpRequest(); // create new AJAX request

    xhttp.onreadystatechange = function () {
        if (this.status == 200) {
            document.getElementById(
                "imageStatus"
            ).innerHTML = this.responseText;
        } else {
            document.getElementById("imageStatus").innerHTML =
                "مشکلی از سمت سرور رخ داده است";
        }
    };

    xhttp.open("POST", "/dashboard/image-upload");
    let formData = new FormData();

    formData.append("image", document.getElementById("selectedImage").files[0]);
    xhttp.send(formData);
};
