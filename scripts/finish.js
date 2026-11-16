(function() {
    const Result = {
        init() {
            const url = new URL(location.href);
            const testId = url.searchParams.get("id");
            const results = url.searchParams.get("results");
            const score = url.searchParams.get("score")
            const total = url.searchParams.get("total");
            document.getElementById("result").innerText= score+ "/" + total;



            document.getElementById("finish_link").onclick = function () {
                location.href = "results.html?id="+testId+"&results="+results+"&score="+score+"&total="+total;
            }
        }

    }
    Result.init();
})();