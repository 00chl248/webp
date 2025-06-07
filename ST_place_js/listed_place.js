// 선택된 필터 불러오기
const filter = JSON.parse(localStorage.getItem('filter'));
const sortSelect = document.getElementById('sort-select');

// 1. 필터 요약 출력
function renderFilterSummary() {
  const getLabel = (key, value) => {
    if (!value) return '전체 보기';
    const labels = {
      time: {
        morning: '오전',
        afternoon: '오후',
        evening: '저녁'
      },
      purpose: {
        study: '공부하려고',
        date: '데이트하려고',
        rest: '쉬려고'
      },
      mood: {
        quiet: '조용한 곳!',
        lively: '활기찬 곳!',
        open: '트인 곳!'
      }
    };
    return labels[key][value] || value;
  };

  document.getElementById('filter-summary').innerHTML = `
    <p><strong>🔍 현재 선택:</strong></p>
    <ul>
      <li>이용 시각: ${getLabel('time', filter.time)}</li>
      <li>용도: ${getLabel('purpose', filter.purpose)}</li>
      <li>분위기: ${getLabel('mood', filter.mood)}</li>
    </ul>
  `;
}

// 2. 카드 불러오기 + 필터링 + 정렬
function loadCards() {
  fetch('/places/places.json') 
    .then(res => res.json())
    .then(data => {
      const result = data.filter(place => {
        const tags = place.tags;

        const timeMatch = !filter.time || tags.time.includes(filter.time);
        const purposeMatch = !filter.purpose || tags.purpose.includes(filter.purpose);
        const moodMatch = !filter.mood || tags.mood.includes(filter.mood);

        return timeMatch && purposeMatch && moodMatch;
      });

      // 기본 무작위 정렬
      result.sort(() => Math.random() - 0.5);

      renderCards(result);
    })
    .catch(err => {
      console.error('카드 불러오기 실패:', err);
    });
}


// 3. 카드 렌더링

  function renderCards(places) {
    const container = document.getElementById('card-container');
    const noResult = document.getElementById('no-results');
    container.innerHTML = '';
  
    if (places.length === 0) {
      noResult.style.display = 'block';
      return;
    }
  
    noResult.style.display = 'none';
  
    places.forEach(place => {
      const card = document.createElement('div');
      card.className = 'card';
  
      card.innerHTML = `
        <h3>${place.name}</h3>
        <p><strong>위치:</strong> ${place.location}</p>
        <p>${place.desc}</p>
        <img src="/places/place_images/${place.image}" alt="${place.name}" style="width: 100%; max-width: 300px; border-radius: 8px;" />
`;

  
      container.appendChild(card);
    });
  }
  

// 초기 실행
renderFilterSummary();
loadCards();

// 정렬 옵션 변경 시 다시 로드
sortSelect.addEventListener('change', loadCards);
