(function () {
    // Tạo khung giao diện nổi
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.background = "white";
    container.style.padding = "10px";
    container.style.border = "1px solid #ccc";
    container.style.borderRadius = "8px";
    container.style.zIndex = "999999";
    container.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.width = "360px";

    // Ô nhập URL
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Dán link Quizizz tại đây...";
    input.style.width = "100%";
    input.style.padding = "8px";
    input.style.marginBottom = "8px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    input.id = "quiz-url";

    // Nút lấy đáp án
    const button = document.createElement("button");
    button.textContent = "📥 Lấy đáp án";
    button.style.padding = "8px 16px";
    button.style.backgroundColor = "#673ab7";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.width = "100%";

    // Thanh tìm kiếm câu hỏi
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "🔍 Tìm câu hỏi...";
    searchInput.style.width = "100%";
    searchInput.style.padding = "6px";
    searchInput.style.margin = "10px 0";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "4px";
    searchInput.style.display = "none"; // Ẩn ban đầu, hiện sau khi có kết quả

    // Vùng hiển thị kết quả
    const resultContainer = document.createElement("div");
    resultContainer.id = "quiz-answers";
    resultContainer.style.marginTop = "12px";
    resultContainer.style.maxHeight = "400px";
    resultContainer.style.overflowY = "auto";
    resultContainer.style.fontSize = "14px";

    // Thêm các phần tử vào DOM
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(searchInput);
    container.appendChild(resultContainer);
    document.body.appendChild(container);

    // Bộ nhớ tạm danh sách block câu hỏi
    let allQuestionBlocks = [];

    // Lọc câu hỏi
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        allQuestionBlocks.forEach(block => {
            const text = block.textContent.toLowerCase();
            block.style.display = text.includes(keyword) ? "block" : "none";
        });
    });

    // Sự kiện click nút lấy đáp án
    button.addEventListener("click", async () => {
        const quizUrl = input.value.trim();
        if (!quizUrl.startsWith("http")) {
            alert("Vui lòng nhập đường dẫn hợp lệ!");
            return;
        }

        const encodedUrl = encodeURIComponent(quizUrl);
        const apiUrl = `https://api.quizit.online/quizizz/answers?pin=${encodedUrl}`;

        resultContainer.innerHTML = "<i>🔄 Đang lấy dữ liệu...</i>";
        allQuestionBlocks = [];
        searchInput.style.display = "none";

        try {
            const res = await fetch(apiUrl);
            const json = await res.json();

            if (json.message !== "Ok" || !json.data || !json.data.answers) {
                resultContainer.innerHTML = "❌ Không tìm thấy đáp án.";
                return;
            }

            resultContainer.innerHTML = "";
            json.data.answers.forEach((item, index) => {
                const questionText = item.question?.text || "Không có câu hỏi";
                const answers = item.answers?.map(a => a.text).join(", ");

                const block = document.createElement("div");
                block.style.marginBottom = "15px";
                block.style.borderBottom = "1px solid #ccc";
                block.style.paddingBottom = "10px";

                const q = document.createElement("div");
                q.innerHTML = `<strong>Câu ${index + 1}:</strong> ${questionText}`;
                const a = document.createElement("div");
                a.innerHTML = `<span style="color: green;"><strong>Đáp án:</strong> ${answers}</span>`;

                block.appendChild(q);
                block.appendChild(a);
                resultContainer.appendChild(block);
                allQuestionBlocks.push(block);
            });

            if (allQuestionBlocks.length > 0) {
                searchInput.style.display = "block";
            }

        } catch (err) {
            resultContainer.innerHTML = "⚠️ Lỗi khi tải dữ liệu: " + err.message;
            console.error(err);
        }
    });
})();
