const form = document.getElementById("f");
const input = document.getElementById("i");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js")



if (form && input) {
    form.addEventListener("submit", async (event) => {
        function isUrl(val = "") {
            if (
                /^http(s?):\/\//.test(val) ||
                (val.includes(".") && val.substr(0, 1) !== " ")
            ) {
                return true;
            }
            return false;
        }

        event.preventDefault();

        try {
            await registerSW();

            console.log("Registering service worker...");
        } catch (err) {
            error.textContent = "Failed to register service worker.";
            errorCode.textContent = err.toString();
            throw err;
        }
        var url = input.value;

        if (!isUrl(url)) {
            url = "https://www.google.com/search?q=" + url;
        } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = `https://${url}`;
        }


        let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        if (await connection.getTransport() !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }

        console.log(__uv$config.encodeUrl(url));
    });
}