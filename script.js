// Contact Form Submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Price Animation (Mock Update)
setInterval(() => {
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        priceElement.style.opacity = '0';
        setTimeout(() => {
            priceElement.textContent = `$${Math.floor(Math.random() * 1000 + 85000)}.${Math.floor(Math.random() * 100)}`;
            priceElement.style.opacity = '1';
        }, 500);
    }
}, 5000);

// Mock historical Bitcoin price data (in USD) as a fallback
const mockBitcoinPrices = {
    '2013-04-29': 144,
    '2020-01-01': 7200,
    '2024-01-01': 42000,
    '2025-01-01': 88000,
    '2025-03-28': 86551.8
};

// Function to get Bitcoin price on a specific date (mock implementation as fallback)
function getMockBitcoinPrice(date) {
    console.log(`Using mock price for date: ${date}`);
    if (mockBitcoinPrices[date]) {
        return mockBitcoinPrices[date];
    }

    const dates = Object.keys(mockBitcoinPrices).sort();
    let closestDate = dates[0];
    let minDiff = Math.abs(new Date(date) - new Date(closestDate));

    for (const d of dates) {
        const diff = Math.abs(new Date(date) - new Date(d));
        if (diff < minDiff) {
            minDiff = diff;
            closestDate = d;
        }
    }

    return mockBitcoinPrices[closestDate];
}

// Function to fetch Bitcoin price from CoinGecko API
async function getBitcoinPrice(date) {
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}`;

    console.log(`Fetching price for date: ${formattedDate} from CoinGecko API`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.market_data && data.market_data.current_price) {
            const price = data.market_data.current_price.usd;
            console.log(`Price for ${formattedDate}: $${price}`);
            return price;
        } else {
            console.log(`No price data available for ${formattedDate}, using mock data`);
            return getMockBitcoinPrice(date);
        }
    } catch (error) {
        console.error(`Error fetching Bitcoin price for ${formattedDate}:`, error.message);
        console.log('Falling back to mock data');
        return getMockBitcoinPrice(date);
    }
}

// Function to calculate ROI
function calculateROI(amountInvested, buyPrice, sellPrice) {
    if (!buyPrice || !sellPrice) {
        console.error('Invalid prices for ROI calculation:', { buyPrice, sellPrice });
        return null;
    }

    const btcBought = amountInvested / buyPrice;
    const finalValue = btcBought * sellPrice;
    const roi = ((finalValue - amountInvested) / amountInvested) * 100;
    return {
        roi: roi.toFixed(2),
        finalValue: finalValue.toFixed(2)
    };
}

// Function to fetch Bitcoin news from NewsAPI
async function fetchBitcoinNews() {
    const apiKey = 'YOUR_NEWSAPI_KEY'; // Replace with your NewsAPI key
    const url = `https://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=${apiKey}&pageSize=6`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'ok' && data.articles.length >= 6) {
            // Update Blog Posts
            const blogPosts = document.querySelectorAll('.blog-post');
            for (let i = 0; i < 3; i++) {
                const article = data.articles[i];
                blogPosts[i].querySelector('img').src = article.urlToImage || 'assets/placeholder.jpg';
                blogPosts[i].querySelector('h3').textContent = article.title;
                blogPosts[i].querySelector('p').textContent = article.description || 'No description available.';
                blogPosts[i].querySelector('a').href = article.url;
            }

            // Update Latest Articles
            const articles = document.querySelectorAll('.article');
            for (let i = 0; i < 3; i++) {
                const article = data.articles[i + 3];
                articles[i].querySelector('img').src = article.urlToImage || 'assets/placeholder.jpg';
                articles[i].querySelector('h3 a').textContent = article.title;
                articles[i].querySelector('h3 a').href = article.url;
            }
        } else {
            console.error('Error fetching news:', data.message || 'Insufficient articles');
        }
    } catch (error) {
        console.error('Error fetching Bitcoin news:', error);
    }
}

// Main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Save preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // FAQ Read More
    const readMoreBtn = document.getElementById('read-more-faq');
    const hiddenFaqs = document.querySelectorAll('.faq-item.hidden');

    readMoreBtn.addEventListener('click', () => {
        hiddenFaqs.forEach(faq => {
            faq.classList.remove('hidden');
        });
        readMoreBtn.style.display = 'none';
    });

// Bitcoin Price Chart
// Get the canvas context
const ctx = document.getElementById('bitcoinPriceChart');
let chart;

// Updated data for March 28, 2025, 9:00 PM PDT to March 29, 2025, 12:00 PM PDT
let labels = [
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', // March 28
    '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', 
    '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', 
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', 
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
    '12:00 PM' // March 29
];
let priceData = [
    84000,  // 9:00 PM, March 28
    84500,  // 9:30 PM
    84000,  // 10:00 PM
    84800,  // 10:30 PM
    84300,  // 11:00 PM
    85000,  // 11:30 PM
    84500,  // 12:00 AM, March 29
    85200,  // 12:30 AM
    84700,  // 1:00 AM
    85500,  // 1:30 AM
    85000,  // 2:00 AM
    85700,  // 2:30 AM
    85200,  // 3:00 AM
    86000,  // 3:30 AM
    85500,  // 4:00 AM
    86200,  // 4:30 AM
    85700,  // 5:00 AM
    86500,  // 5:30 AM
    86000,  // 6:00 AM
    86700,  // 6:30 AM
    86200,  // 7:00 AM
    87000,  // 7:30 AM
    86500,  // 8:00 AM
    87200,  // 8:30 AM
    86700,  // 9:00 AM
    87500,  // 9:30 AM
    87000,  // 10:00 AM
    87700,  // 10:30 AM
    87200,  // 11:00 AM
    88000,  // 11:30 AM
    84500   // 12:00 PM
];

// Function to initialize or update the chart
function updateChart() {
    if (ctx) {
        if (chart) {
            // Update existing chart
            chart.data.labels = labels;
            chart.data.datasets[0].data = priceData;
            chart.update();
        } else {
            // Create new chart
            chart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Bitcoin Price (USD)',
                        data: priceData,
                        borderColor: '#F7931A', // Yellow line
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, 'rgba(247, 147, 26, 0.4)'); // Yellow at the top
                            gradient.addColorStop(1, 'rgba(247, 147, 26, 0)'); // Transparent at the bottom
                            return gradient;
                        },
                        fill: true,
                        tension: 0, // Sharp zig-zag lines
                        pointRadius: 0 // Hide points for a smoother look
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 83000, // Adjusted to fit the price range
                            max: 88000,
                            ticks: {
                                callback: function(value) {
                                    return (value / 1000).toFixed(2) + 'K'; // Format as 87.50K
                                },
                                color: '#e0e0e0',
                                stepSize: 500
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            title: {
                                display: true,
                                text: 'Price (USD)',
                                color: '#e0e0e0'
                            }
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 8, // Show fewer labels for readability
                                color: '#e0e0e0'
                            },
                            grid: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Time',
                                color: '#e0e0e0'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Hide the legend
                        }
                    },
                    elements: {
                        line: {
                            borderWidth: 2
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    }
                }
            });
        }
    } else {
        console.warn('Bitcoin price chart element not found');
    }
}

// Function to format time as "H:MM AM/PM"
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
    return `${formattedHours}:${minutes} ${ampm}`;
}

// Function to fetch a new Bitcoin price (simulated for now, can be replaced with a real API call)
function getNewBitcoinPrice() {
    // Simulate a price fluctuation with a zig-zag pattern
    const lastPrice = priceData[priceData.length - 1];
    const fluctuation = (Math.random() * 1000) - 500; // Random change between -500 and +500
    return Math.round(lastPrice + fluctuation);
}

// Function to update the chart data every hour
function updateChartData() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Check if it's the start of a new hour (e.g., 12:00, 1:00, etc.)
    if (currentMinutes === 0) {
        // Remove the oldest data point (first element)
        labels.shift();
        priceData.shift();

        // Add the new time label (current time)
        const newTimeLabel = formatTime(now);
        labels.push(newTimeLabel);

        // Add a new price (simulated for now, replace with API call)
        const newPrice = getNewBitcoinPrice();
        priceData.push(newPrice);

        // Update the chart
        updateChart();

        console.log(`Updated chart at ${newTimeLabel} with new price: ${newPrice}`);
    }
}

// Initialize the chart
updateChart();

// Check for updates every minute (60,000 milliseconds)
setInterval(() => {
    updateChartData();
}, 60 * 1000);

// For testing: Simulate an immediate update if needed
updateChartData();

    // Fetch Bitcoin news
    fetchBitcoinNews();

    // Schedule daily refresh (every 24 hours)
    setInterval(fetchBitcoinNews, 24 * 60 * 60 * 1000);

    // ROI Calculator
    const calculateBtn = document.getElementById('calculate-roi');
    const amountInput = document.getElementById('amount-invested');
    const dateBuyInput = document.getElementById('date-buy');
    const dateSoldInput = document.getElementById('date-sold');
    const roiResult = document.getElementById('roi-result');

    if (!calculateBtn || !amountInput || !dateBuyInput || !dateSoldInput || !roiResult) {
        console.error('One or more ROI calculator elements not found:', {
            calculateBtn, amountInput, dateBuyInput, dateSoldInput, roiResult
        });
        return;
    }

    calculateBtn.addEventListener('click', async () => {
        console.log('Calculate ROI button clicked');

        const amountInvested = parseFloat(amountInput.value);
        const dateBuy = dateBuyInput.value;
        const dateSold = dateSoldInput.value;

        console.log('Input values:', { amountInvested, dateBuy, dateSold });

        // Validate inputs
        if (!amountInvested || amountInvested <= 0) {
            roiResult.textContent = 'Please enter a valid amount invested.';
            console.warn('Invalid amount invested:', amountInvested);
            return;
        }

        if (!dateBuy || !dateSold) {
            roiResult.textContent = 'Please select both buy and sell dates.';
            console.warn('Missing dates:', { dateBuy, dateSold });
            return;
        }

        if (new Date(dateBuy) >= new Date(dateSold)) {
            roiResult.textContent = 'Sell date must be after buy date.';
            console.warn('Sell date is not after buy date:', { dateBuy, dateSold });
            return;
        }

        // Show loading state
        roiResult.textContent = 'Calculating...';
        console.log('Fetching prices...');

        // Fetch Bitcoin prices for the selected dates using CoinGecko API
        const buyPrice = await getBitcoinPrice(dateBuy);
        const sellPrice = await getBitcoinPrice(dateSold);

        console.log('Fetched prices:', { buyPrice, sellPrice });

        if (!buyPrice || !sellPrice) {
            roiResult.textContent = 'Unable to fetch Bitcoin prices for the selected dates. Using mock data.';
            console.warn('Using mock data due to API failure');
            return;
        }

        // Calculate ROI
        const result = calculateROI(amountInvested, buyPrice, sellPrice);
        if (result) {
            roiResult.innerHTML = `
                <p>Initial Investment: $${amountInvested.toFixed(2)}</p>
                <p>Final Value: $${result.finalValue}</p>
                <p>ROI: ${result.roi}%</p>
            `;
            console.log('ROI calculated successfully:', result);
        } else {
            roiResult.textContent = 'Error calculating ROI. Please try again.';
            console.error('ROI calculation failed');
        }
    });
});

function toggleContent() {
    const moreContent = document.getElementById('more-content');
    const viewMoreLink = document.querySelector('.view-more');

    if (moreContent.classList.contains('hidden')) {
        moreContent.classList.remove('hidden');
        moreContent.classList.add('show');
        viewMoreLink.textContent = 'View Less';
    } else {
        moreContent.classList.remove('show');
        moreContent.classList.add('hidden');
        viewMoreLink.textContent = 'View More';
    }
}
