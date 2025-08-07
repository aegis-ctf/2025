let timeLeft = 600; //10分鐘
let currentLevel = 0;
let timerRunning = true; //倒數計時器是否繼續

let clickedCart = false;
let clickedBuy = false;

const types = ["heart", "diamond", "spade", "club"];

// 顯示 chosenSymbol（你可以用 emoji 或字串）
const symbols = {
  heart: "♥️",
  diamond: "♦️",
  spade: "♠️",
  club: "♣️"
};

const chosenSymbol = types[Math.floor(Math.random() * types.length)];

const baseDigits = {
  beige: 3,
  green: 2,
  yellow: 1,
  orange: 4
};

const symbolOrders = {
  //answers
  heart: ["beige", "green", "yellow", "orange"], // 3214
  diamond: ["yellow", "beige", "green", "orange"], // 1324
  club: ["green", "orange", "beige", "yellow"], // 2431
  spade: ["orange", "green", "yellow", "beige"] // 4213
};

const colorMap = {
  //answers
  1: "#FADA7A", // yellow
  2: "#B1C29E", // green
  3: "#FCE7C8", // beige
  4: "#F0A04B" // orange
};

const cardLabels = {
  heart: ["J", "Q", "K", "A"],
  diamond: ["K", "Q", "A", "J"],
  club: ["A", "Q", "K", "J"],
  spade: ["Q", "A", "K", "J"]
};

function setCardLabels(symbol) {
  const labels = cardLabels[symbol];
  const labelEls = document.querySelectorAll("#level-3 .card-label");
  labels.forEach((char, index) => {
    labelEls[index].textContent = char;
  });
}

function setInputColors(symbol) {
  const code = getAnswer(symbol); // 比如 "3214"
  const OTPinputs = document.querySelectorAll("#level-3 .input_fields input");

  for (let i = 0; i < OTPinputs.length; i++) {
    const colorCode = colorMap[parseInt(code[i])];
    OTPinputs[i].style.backgroundColor = colorCode;
  }
}

function getAnswer(symbol) {
  const order = symbolOrders[symbol]; // 例如 ["beige", "green", "yellow", "orange"]
  return order.map((color) => baseDigits[color]).join(""); // 轉成數字再合併
}

const levels = [
  { url: "https://amaz0n.com", message: "🎉 恭喜你答對了！🎉", card: "" },
  { url: "http://paypa1.com", message: "🎉 恭喜你答對了！🎉", card: "" },
  { url: "http://paypa1.com", message: "🎉 恭喜你答對了！🎉", card: "" }
];

function updateSubmitButtonState() {
  const inputs = document.querySelectorAll("#level-3 .input_fields input");
  const allFilled = Array.from(inputs).every((input) => input.value !== "");
  const submitButton = document.querySelector("#level-3 button[type='button']");
  if (allFilled) {
    submitButton.classList.add("active");
  } else {
    submitButton.classList.remove("active");
  }
}

function setupAutoAdvanceInputs() {
  const oldInputs = document.querySelectorAll("#level-3 .input_fields input");

  oldInputs.forEach((input, idx) => {
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    newInput.addEventListener("input", (e) => {
      const val = newInput.value.replace(/[^0-9]/g, "");
      if (val) {
        newInput.value = val[0];

        // 重新取得最新的 inputs（含新綁定的 input）
        const currentInputs = document.querySelectorAll(
          "#level-3 .input_fields input"
        );
        if (idx < currentInputs.length - 1) {
          currentInputs[idx + 1].focus();
        }
      }
      updateSubmitButtonState();
    });

    newInput.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (newInput.value !== "") {
          newInput.value = "";
        } else if (idx > 0) {
          const currentInputs = document.querySelectorAll(
            "#level-3 .input_fields input"
          );
          currentInputs[idx - 1].focus();
        }
      }
    });

    newInput.addEventListener("focus", () => {
      newInput.select();
    });
  });

  console.log("✅ setupAutoAdvanceInputs() 已完成綁定");
}

function stopTimer() {
  timerRunning = false; //停止倒數
}

// 更新倒數計時器
function updateTimer() {
  if (timeLeft > 0 && timerRunning) {
    timeLeft--;
    document.getElementById("minute").textContent = String(
      Math.floor(timeLeft / 60)
    ).padStart(2, "0");
    document.getElementById("second").textContent = String(
      timeLeft % 60
    ).padStart(2, "0");

    let progress = (timeLeft / 600) * 100;
    document.getElementById("progressBar").firstElementChild.style.width =
      progress + "%";

    setTimeout(updateTimer, 1000);
  } // if
  else if (timeLeft <= 0) {
    alert("⚠️時間到！遊戲結束！⚠️");
    document.getElementById("gameOverScreen").style.display = "flex";
    location.reload();
  } //else if
}

function renderAnswerDisplay() {
  const container = document.getElementById("final-answer-display");
  container.innerHTML = "";

  const order = symbolOrders[chosenSymbol];
  const digits = order.map((color) => baseDigits[color]);

  digits.forEach((digit) => {
    const span = document.createElement("span");
    span.textContent = `${digit}`;
    span.style.backgroundColor = colorMap[digit];
    span.style.border = "2px solid white";
    /*span.style.textShadow = "1px 1px 2px #999";*/
    container.appendChild(span);
  });
}

let level2Completed = false;
// 檢查答案
function checkAnswer() {
  /*alert(levels[currentLevel].message); */
  document.getElementById("popup-text").textContent =
    levels[currentLevel].message;

  if (currentLevel == 0) {
    document.getElementById("popup-1").style.display = "block";
  } else if (currentLevel == 1) {
    if (level2Completed) return; // ✅ 如果已經觸發過就不再執行
    level2Completed = true; // ✅ 第一次觸發就設為 true
    document.getElementById("popup-2").style.display = "block";
    document.querySelector("#popup-2 #popup-text").innerText =
    levels[currentLevel].message;
  } else if (currentLevel == 2) {
    // 第3關
    const correctAnswer = getAnswer(chosenSymbol);
    const OTPinputs = document.querySelectorAll("#level-3 .input_fields input");
    const userAnswer = Array.from(OTPinputs)
      .map((input) => input.value)
      .join("");
    const popup = document.getElementById("popup-3");
    const popupText = popup.querySelector("#popup-text");

    if (userAnswer === correctAnswer) {
      popupText.textContent = levels[currentLevel].message;
      popup.style.display = "block";
      popup.querySelector(".button-13").style.display = "block";
    } else {
      popupText.textContent = "❌ 很可惜，這不是正確答案！";
      popup.style.display = "block";

      OTPinputs.forEach((input, index) => {
        if (input.value !== correctAnswer[index]) {
          input.classList.add("input-error");
        }
      });

      setTimeout(() => {
        OTPinputs.forEach((input) => {
          input.classList.remove("input-error");
          input.value = "";
          input.disabled = false; // ✅ 全部都要能再輸入
        });
        setInputColors(chosenSymbol);
        setupAutoAdvanceInputs();

        OTPinputs[0].focus(); // 再次聚焦第一格
        // ❗延遲 10ms 再隱藏 popup，避免 UI 被打斷
        /*
    setTimeout(() => {
        popup.style.display = "none";
    }, 10);
    */
        popup.style.display = "none"; // 隱藏 popup
      }, 1000);
    } //else
  } // 第3關 currentLevel == 2結束
}

// 產品資料，依據產品標題設定對應的詳細資訊
const productData = {
  "Sony WH-1000XM5 Wireless Headphones": {
    description:
      "可自動依偑戴狀況和環境自動降噪，將不受干擾的聆聽體驗和通話清晰度提升至全新境界。",
    reviews: [
      {
        rating: 5,
        comment: "Sony藍芽耳機外觀超美，音色也完美!!",
        author: "Wendy"
      },
      { rating: 4, comment: "質感很好，但很昂貴。", author: "Patty" },
      { rating: 5, comment: "降噪能力超級好!!", author: "Chen" }
    ],
    imageUrl:
      "https://store.sony.com.tw/resource/file/product_files/WH-1000XM5-P/48_f4ed13641.jpg"
  },

  "Apple Watch Series 10": {
    description:
      "首款提供廣視角OLED 顯示器的Apple 產品，從特定角度觀看時，顯示器的亮度高出40%，使閱讀變得更輕易、快速。",
    reviews: [
      { rating: 5, comment: "Apple手錶質感就是好!!", author: "Andy" },
      { rating: 4, comment: "價格過於昂貴。", author: "Alex" }
    ],
    imageUrl:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MXM83ref_FV99_VW_34FR+watch-case-46-aluminum-rosegold-nc-s10_VW_34FR+watch-face-46-aluminum-rosegold-s10_VW_34FR?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1725645481882"
  },

  "Samsung QLED 4K Q60C TV": {
    description:
      "擁有金屬量子點顯色技術的QLED 4K Q60C可以呈現完整的色彩，搭載Quantum HDR技術，可以展現影像中的細節。",
    reviews: [
      { rating: 5, comment: "三星電視外型很完美!", author: "Cindy" },
      { rating: 3, comment: "寄送速度太慢!", author: "Ruby" }
    ],
    imageUrl: "https://m.media-amazon.com/images/I/71bmtncxa+L.jpg"
  },

  "Apple iPad Pro 11-inch": {
    description:
      "具備ProMotion 自動適應更新頻率、P3 廣色域與原彩顯示等先進技術。",
    reviews: [{ rating: 5, comment: "Ipad很方便攜帶!", author: "Omo" }],
    imageUrl:
      "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/ipad-pro-11-inch-13-inch.png"
  },

  "Nintendo Switch OLED Model": {
    description:
      "家庭用遊戲機，不單止可連接電視來玩，也可配合遊戲方式，自由選擇3中模式。",
    reviews: [
      { rating: 5, comment: "Switch超級好玩!", author: "Tim" },
      { rating: 5, comment: "後悔晚買了 :( ", author: "Henry" },
      { rating: 3, comment: "可以多人連線，聚會玩很開心。", author: "Anita" }
    ],
    imageUrl:
      "https://i0.wp.com/uploads.saigacdn.com/2021/07/nintendo-switch-oled-model-00.jpg"
  },

  "Kindle Paperwhite (16GB)": {
    description:
      "Amazon推出的電子紙閱讀器，採用7吋300ppi的Paperwhite顯示器，具備IPX8防水等級，可以在浴室或泳池邊安心閱讀。",
    reviews: [
      { rating: 5, comment: "電子書很方便攜帶!", author: "Henry" },
      { rating: 3, comment: "電子紙閱讀器畫質不夠高。", author: "Percy" }
    ],
    imageUrl:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1667850366/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/251101_0_cjns1e.png"
  },

  "Bose QuietComfort Earbuds II": {
    description:
      "將耳塞放入耳朵時，麥克風會捕捉並評估響起的聲響，藉此判斷最適合每個耳朵的設定，以確保聲音到達耳膜時能夠達成完美平衡。",
    reviews: [{ rating: 5, comment: "藍芽耳機超有質感!!", author: "Sky" }],
    imageUrl:
      "https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_earbuds_ii/product_silo_image/CTP-36312_ECOM_QCEII_Triple_Black_2.png/jcr:content/renditions/cq5dam.web.1920.1920.png"
  },

  "Marshall Acton III": {
    description:
      "透過上方的高音、低音、音量等黃銅旋鈕和多項控制按鍵，無需使用你的電子設備即可輕鬆控制音樂。",
    reviews: [
      { rating: 5, comment: "喇叭本人超級有質感!", author: "Monica" },
      { rating: 5, comment: "除了價格以外，其他都很完美!", author: "Kelly" },
      { rating: 5, comment: "外型超美!", author: "Christina" }
    ],
    imageUrl:
      "https://down-tw.img.susercontent.com/file/tw-11134207-7r98u-lo2biksh534t91"
  },

  "MacBook Air M4": {
    description:
      "M4晶片配備強大的10核心CPU、最多10 核心GPU，且支援高達32GB的統一記憶體，速度最快可達兩倍。",
    reviews: [
      { rating: 5, comment: "筆電超有質感!", author: "Benny" },
      { rating: 4, comment: "會一直購買蘋果的電腦!", author: "Charles" },
      { rating: 5, comment: "筆電CPU運算快速!", author: "Alan" }
    ],
    imageUrl:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1741278345/Croma%20Assets/Computers%20Peripherals/Laptop/Images/314077_czjks8.png"
  },

  "Canon EOS R50": {
    description:
      "最輕最小的EOS R相機，EOS R50機身僅重375g，具備無裁切6K超取樣4K 30p短片及「近拍展示」模式令拍攝VLOG更方便。",
    reviews: [
      { rating: 5, comment: "用相機拍照還是比較好看!", author: "Alice" },
      { rating: 3, comment: "效果不錯，但稍微貴一點。", author: "Andy" }
    ],
    imageUrl:
      "https://cdn.shoplightspeed.com/shops/650021/files/52365725/1652x1652x1/canon-canon-eos-r50-mirrorless-camera.jpg"
  },

  "PlayStation 5 Console": {
    description:
      "透過觸覺回饋、自適應板機與3D音效技術支援，發掘更深刻的遊戲體驗。",
    reviews: [{ rating: 5, comment: "超級好玩!!!", author: "Jay" }],
    imageUrl:
      "https://action-v2-backend.b-cdn.net/38168/Pw36eX3hHQuH7i1jTjWD5iZluLYgP53wKtns2B2j.png"
  },

  "Dyson Airstraight": {
    description: "利用氣流，從濕髮吹乾同時順直髮絲。沒有加熱面板以避免熱傷害。",
    reviews: [
      { rating: 5, comment: "吹完的頭髮很好看!", author: "Alice" },
      { rating: 4, comment: "效果不錯，但稍微貴一點。", author: "Bob" }
    ],
    imageUrl:
      "https://m.media-amazon.com/images/I/514zE5WSO9L._AC_UF894,1000_QL80_.jpg"
  }

  // 若有其他產品，可繼續加入
};

// 取得顯示詳情的 modal 元素與關閉按鈕
const productDetail = document.getElementById("productDetail");
const closeBtn = document.getElementById("closeBtn");

// 取得所有產品卡片（假設 class 為 .product-card）
const cards = document.querySelectorAll(".product-card");

// 為每個產品卡片加上點擊事件，點擊後顯示該產品的詳情
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // 取得產品資訊
    const title = card.querySelector("h3").textContent;
    const price = card.querySelector(".price").textContent;
    // 這裡假設產品卡片的結構為：
    // <img>、<h3>、<div class="price">、<div>(評價內容)</div>、<button>
    // 使用 querySelector('div:nth-child(4)') 取得第四個子元素的文字內容作為評價
    const rating = card.querySelector("div:nth-child(4)").textContent;

    // 將基本資訊填入 modal
    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailPrice").textContent = price;
    document.getElementById("detailRating").textContent = rating;

    // 根據產品標題取得額外資料，若找不到則使用預設資料
    const data = productData[title] || {
      description: "Detailed product description coming soon...",
      reviews: [],
      imageUrl: ""
    };

    document.getElementById("detailDescription").textContent = data.description;

    // 清空評論容器，然後依序建立評論元素
    const reviewsContainer = document.getElementById("reviewsContainer");
    reviewsContainer.innerHTML = "";
    data.reviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "review";
      reviewElement.innerHTML = `
        <div class="star-rating">${"⭐".repeat(review.rating)}</div>
        <p>${review.comment}</p>
        <small>- ${review.author}</small>
      `;
      reviewsContainer.appendChild(reviewElement);
    });

    // 設定產品圖片，並顯示 modal
    document.getElementById("detailImage").src = data.imageUrl;
    productDetail.style.display = "block";
  });
});

// 當使用者點擊關閉按鈕時，隱藏產品詳情 modal
closeBtn.addEventListener("click", () => {
  productDetail.style.display = "none";
});

// 當使用者點擊 modal 區塊背景時，若點擊位置為 modal 本身（非內部內容），也隱藏 modal
productDetail.addEventListener("click", (e) => {
  if (e.target === productDetail) {
    productDetail.style.display = "none";
  }
});

const symbolSVG = {
  heart: {
    left: `<path d="M25 47 L9 31 C3 25 3 14 11 10 C17 7 22 10 25 15 Z" fill="#FF6B81" stroke="black" stroke-width="4" />`,
    right: `<path d="M25 47 L41 31 C47 25 47 14 39 10 C33 7 28 10 25 15 Z" fill="#FF6B81" stroke="black" stroke-width="4" />`,
    full: `<path d="M25 47 L9 31 C3 25 3 14 11 10 C17 7 22 10 25 15 C28 10 33 7 39 10 C47 14 47 25 41 31 Z" fill="#FF6B81" stroke="black" stroke-width="4" />`
  },
  diamond: {
    left: `<path d="M25 5 L10 25 L25 45 L25 5 Z" fill="#FF9F1C" stroke="black" stroke-width="4" />`,
    right: `<path d="M25 5 L40 25 L25 45 Z" fill="#FF9F1C" stroke="black" stroke-width="4" />`,
    full: `<path d="M25 5 L10 25 L25 45 L40 25 Z" fill="#FF9F1C" stroke="black" stroke-width="4" />`
  },
  spade: {
    left: `<path d="M25 4.57 C24.2 5.08 4.71 16.96 4.71 27.48 A10.99 10.99 0 0 0 20.79 37.23 L18.45 44.26 A1.57 1.57 0 0 0 19.93 46.33 H25 Z" fill="#5C7AFF" stroke="black" stroke-width="4"/>`,
    right: `<path d="M25 4.57 C25.8 5.08 45.53 16.96 45.53 27.48 A10.99 10.99 0 0 1 29.46 37.23 L31.8 44.26 A1.57 1.57 0 0 1 30.31 46.33 H25 Z" fill="#5C7AFF" stroke="black" stroke-width="4"/>`,
    full: `<path d="M45.53 27.475a10.99 10.99 0 0 1 -16.074 9.745l2.342 7.031a1.57 1.57 0 0 1 -1.49 2.067H19.93a1.57 1.57 0 0 1 -1.49 -2.067l2.342 -7.031A10.99 10.99 0 0 1 4.71 27.475c0 -10.514 19.17 -22.903 19.986 -23.425a0.785 0.785 0 0 1 0.846 0C26.36 4.572 45.53 16.961 45.53 27.475" fill="#5C7AFF" stroke="black" stroke-width="4"/>`
  },
  club: {
    left: `<path d="M25 6.5 C21.5 4.5 16 6.8 14.5 12 C13.9 14.4 14.1 16.5 15.2 18.6 A10.05 10.05 0 0 0 5.5 28.7 A10.05 10.05 0 0 0 17.3 36.1 L15.2 42.7 A1.55 1.55 0 0 0 17.2 45.7 H25 Z" fill="#28C76F" stroke="black" stroke-width="4"/>`,
    right: `<path d="M25 6.5 C28.5 4.5 34 6.8 35.5 12 C36.1 14.4 35.9 16.5 34.8 18.6 A10.05 10.05 0 0 1 44.5 28.7 A10.05 10.05 0 0 1 32.7 36.1 L34.8 42.7 A1.55 1.55 0 0 1 32.8 45.7 H25 Z" fill="#28C76F" stroke="black" stroke-width="4"/>`,
    full: `<path d="M44.95 28.675a10.076 10.076 0 0 1 -15.589 8.433l2.064 6.605A1.55 1.55 0 0 1 29.946 45.725h-10.292a1.55 1.55 0 0 1 -1.479 -2.012l2.063 -6.601a10.017 10.017 0 0 1 -5.805 1.635c-5.372 -0.152 -9.761 -4.651 -9.783 -10.028A10.075 10.075 0 0 1 14.725 18.6q0.393 0 0.784 0.03a10.076 10.076 0 1 1 18.58 0 10.269 10.269 0 0 1 1.059 -0.027A10.017 10.017 0 0 1 44.95 28.675" fill="#28C76F" stroke="black" stroke-width="4" />`
  }
};

function playSymbolAnimation(type) {
  document
    .querySelectorAll(".symbol-container")
    .forEach((c) => c.classList.remove("show"));
  const container = document.querySelector(
    `.symbol-container[data-type="${type}"]`
  );
  container.classList.add("show");

  const left = container.querySelector(".half-symbol.left");
  const right = container.querySelector(".half-symbol.right");
  const full = container.querySelector(".full-symbol");

  const { left: lPath, right: rPath, full: fPath } = symbolSVG[type];
  left.innerHTML = lPath;
  right.innerHTML = rPath;
  full.innerHTML = fPath;

  left.style.display = "block";
  right.style.display = "block";
  full.classList.remove("show");

  left.style.animation = "none";
  right.style.animation = "none";
  void left.offsetWidth;
  void right.offsetWidth;

  setTimeout(() => {
    left.style.animation = "slide-in-left 1s forwards";
    right.style.animation = "slide-in-right 1s forwards";
  }, 100);

  setTimeout(() => {
    full.classList.add("show");
    left.style.display = "none";
    right.style.display = "none";
  }, 1010);
}

function showCard(level) {
  if (level === 3) {
    setInputColors(chosenSymbol);
    document.getElementById(`card-${level - 1}`).style.display = "none";
    document.getElementById(`card-${level}`).style.display = "block";
  } // if
  else {
    document.getElementById(`popup-${level}`).style.display = "none";
    document.getElementById(`card-${level}`).style.display = "block";
  } // else

  const card = document.getElementById(`card-${level}`);
  const square = card.querySelector(".square-card");

  // 取得選中的圖案 SVG
  const { left, right, full } = symbolSVG[chosenSymbol];

  // 設定字卡文字與圖案
  if (level === 1) {
    square.innerHTML = `<svg width="60" height="60" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${left}</svg>`;
  } //if
  else if (level === 2) {
    square.innerHTML = `<svg width="60" height="60" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${right}</svg>`;
  } // else if
  else if (level === 3) {
    square.innerHTML = `
      <div class="symbol-container show" data-type="${chosenSymbol}">
        <svg class="half-symbol left" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${left}</svg>
        <svg class="half-symbol right" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${right}</svg>
        <svg class="full-symbol" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${full}</svg>
      </div>
    `;

    setTimeout(() => playSymbolAnimation(chosenSymbol), 10);
  } // else if
} // showCard()

function showCompletionScreen() {
  stopTimer();
  // renderAnswerDisplay(); //display answer
  document.getElementById("completion-screen").style.display = "block";
}

function createFirework() {
  document.getElementById("fireworks-container").style.display = "block";

  const container = document.querySelector(".fireworks-container");

  for (let i = 0; i < 20; i++) {
    let particle = document.createElement("div");
    particle.classList.add("firework-particle");

    // 隨機位置
    let x = (Math.random() - 0.5) * 200 + "px";
    let y = (Math.random() - 0.5) * 200 + "px";

    particle.style.setProperty("--x", x);
    particle.style.setProperty("--y", y);
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 50 + "vh";
    container.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
  }
}

// 觸發煙花
function showFireworks() {
  setInterval(createFirework, 500);
}

// 在通關時顯示煙花
document.addEventListener("DOMContentLoaded", () => {
  showFireworks();
});

function nextLevel() {
  // alert("進入 nextLevel 函式，currentLevel=" + currentLevel);
  document.getElementById(`card-${currentLevel + 1}`).style.display = "none";

  currentLevel++;
  if (currentLevel === 2) {
    /*alert("切換到第3關！");*/

    document.getElementById("level-1").style.display = "none";

    document.getElementById("level-2").style.display = "none";

    document.getElementById("level-3").style.display = "block";

    const OTPinputs = document.querySelectorAll("#level-3 .input_fields input");
    OTPinputs.forEach((input) => {
      input.disabled = false;
      input.value = "";
    });

    setCardLabels(chosenSymbol);
    setInputColors(chosenSymbol);
    setupAutoAdvanceInputs();
    OTPinputs[0].focus(); // 初始 focus 在第一格

    // 把符號放到「門」前面
    const sayEl = document.getElementById("level-3-say");
    sayEl.innerHTML = `請進入 ${symbols[chosenSymbol]} 門，並於答案卡輸入答案...`;
  } else if (currentLevel === 1) {
    /*alert("切換到第二關！");*/
    document.getElementById("level-1").style.display = "none";

    document.getElementById("level-2").style.display = "block";

    document.getElementById("level-3").style.display = "none";
  } else {
    document.getElementById("level-2").style.display = "none";

    document.getElementById("level-3").style.display = "none";

    showCompletionScreen();
  }
}

document.addEventListener("DOMContentLoaded", updateTimer);

document.querySelector(".cart-now-btn").addEventListener("click", function () {
  if (!clickedCart) {
    alert("⚠️ 這是釣魚網站！⚠️");
    clickedCart = true;
    checkGameOver();
  } // if
}); // function

document.querySelector(".buy-now-btn").addEventListener("click", function () {
  if (!clickedBuy) {
    alert("⚠️ 這是釣魚網站！⚠️");
    clickedBuy = true;
    checkGameOver();
  } // if
}); // function

function checkGameOver() {
  if (clickedCart || clickedBuy) {
    document.getElementById("gameOverScreen").style.display = "flex";
  } // if
} // checkGameOver

const OTPinputs = document.querySelectorAll("input");
const button = document.querySelector("form button"); //針對.container內的按鈕

window.onload = () => OTPinputs[0].focus();

OTPinputs.forEach((input) => {
  input.addEventListener("input", () => {
    const currentInput = input;
    const nextInput = currentInput.nextElementSibling;

    if (currentInput.value.length > 1 && currentInput.value.length == 2) {
      currentInput.value = "";
    }

    if (
      nextInput !== null &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (!OTPinputs[3].disabled && OTPinputs[3].value !== "") {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  input.addEventListener("keyup", (e) => {
    console.log(e);
    if (e.key == "Backspace") {
      if (input.previousElementSibling != null) {
        e.target.value = "";
        e.target.setAttribute("disabled", true);
        input.previousElementSibling.focus();
      }
    }
  });
});
