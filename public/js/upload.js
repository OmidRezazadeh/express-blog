document.getElementById("imageUpload").onclick = function () {
    let xhttp = new XMLHttpRequest(); // create new AJAX request

    const selectedImage = document.getElementById("selectedImage");
    const imageStatus = document.getElementById("imageStatus");
    const progressDiv = document.getElementById("progressDiv");
    const progressBar = document.getElementById("progressBar");
    const uploadResutl = document.getElementById("uploadResult");

    xhttp.responseType= "json";

    xhttp.onreadystatechange = function () {
        if (xhttp.status === 200) {
            imageStatus.innerHTML = "آپلود عکس موفقیت آمیز بود"; //this.response.message
            uploadResutl.innerHTML = this.responseText; //this.response.address
        } else {
            imageStatus.innerHTML = this.responseText;
        }
    };

    xhttp.open("POST", "/dashboard/image-upload");

    xhttp.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            let result = Math.floor((e.loaded / e.total) * 100);
            // console.log(result + "%");
            if (result !== 100) {
                progressBar.innerHTML = result + "%";
                progressBar.style = "width:" + result + "%";
            } else {
                progressDiv.style = "display: none";
            }
        }
    };

    let formData = new FormData();

    if (selectedImage.files.length > 0) {
        progressDiv.style = "display: block";
        formData.append("image", selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
    }
};
