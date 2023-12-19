// Selecting elements from the DOM
const form = document.querySelector(".wrapper form"),
    fullURL = form.querySelector("input"),
    shortenBtn = form.querySelector("form button"),
    blurEffect = document.querySelector(".blur-effect"),
    popupBox = document.querySelector(".popup-box"),
    infoBox = popupBox.querySelector(".info-box"),
    form2 = popupBox.querySelector("form"),
    shortenURL = popupBox.querySelector("form .shorten-url"),
    copyIcon = popupBox.querySelector("form .copy-icon"),
    saveBtn = popupBox.querySelector("button");

// Preventing the form from submitting and refreshing the page
form.onsubmit = (e) => {
    e.preventDefault();
}

// Handling click event for the "Shorten" button
shortenBtn.onclick = () => {
    // Creating an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // Configuring the request to send a POST request to "php/url-controll.php"
    xhr.open("POST", "php/url-controll.php", true);

    // Callback function to handle the response from the server
    xhr.onload = () => {
        // Checking if the request was successful (status code 200) and the response is ready
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Extracting data from the response
            let data = xhr.response;

            // Checking if the data received is a valid shortened URL (length <= 5)
            if (data.length <= 5) {
                // Displaying the blur effect and showing the popup box
                blurEffect.style.display = "block";
                popupBox.classList.add("show");

                // Defining the domain for the shortened URL
                let domain = "localhost/url/";

                // Setting the value of the shortened URL input in the popup
                shortenURL.value = domain + data;

                // Handling click event for the copy icon
                copyIcon.onclick = () => {
                    // Selecting and copying the shortened URL to the clipboard
                    shortenURL.select();
                    document.execCommand("copy");
                }

                // Handling click event for the "Save" button in the popup
                saveBtn.onclick = () => {
                    // Preventing the form in the popup from submitting and refreshing the page
                    form2.onsubmit = (e) => {
                        e.preventDefault();
                    }

                    // Creating a new XMLHttpRequest object for saving the URL
                    let xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", "php/save-url.php", true);

                    // Callback function to handle the response from the server
                    xhr2.onload = () => {
                        // Checking if the request was successful (status code 200) and the response is ready
                        if (xhr2.readyState == 4 && xhr2.status == 200) {
                            // Extracting data from the response
                            let data = xhr2.response;

                            // Checking if the URL was saved successfully
                            if (data == "success") {
                                // Reloading the page
                                location.reload();
                            } else {
                                // Displaying an error message in the popup
                                infoBox.classList.add("error");
                                infoBox.innerText = data;
                            }
                        }
                    }

                    // Getting values for the request parameters
                    let shorten_url1 = shortenURL.value;
                    let hidden_url = data;

                    // Setting the content type for the request
                    xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    // Sending the request with the URL data
                    xhr2.send("shorten_url=" + shorten_url1 + "&hidden_url=" + hidden_url);
                }
            } else {
                // Alerting the user if the data is not a valid shortened URL
                alert(data);
            }
        }
    }

    // Creating a FormData object to send form data with the request
    let formData = new FormData(form);
    // Sending the XMLHttpRequest with the form data
    xhr.send(formData);
}
