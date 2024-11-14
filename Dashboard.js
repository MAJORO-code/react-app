import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css'; // Ensure your CSS file is imported
import mmmImage from './mmm.jpg';
import pppImage from './ppp.jpeg';
import downloadImage1 from './ttt.jpeg'; // Updated import for renamed image
import downloadImage2 from './zzz.jpeg'; // Updated import for renamed image
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5300/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    console.log('Fetched products:', data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const chartData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Quantity',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <section id="dashboard">
            <div id="stockOverview">
                <h2>Product Stock Overview</h2>
                <div className="chart-container"> {/* Small chart container */}
                    {products.length > 0 ? (
                        <Bar 
                            data={chartData} 
                            options={{ responsive: true, maintainAspectRatio: false }} 
                            width={40} // Smaller width
                            height={25} // Smaller height
                        />
                    ) : (
                        <p>No products available to display in the chart.</p>
                    )}
                </div>
            </div>

            <div id="imageCarousel">
                <h2>Menu</h2>
                <Slider {...settings}>
                    <div>
                        <img src={mmmImage} alt="Delicious dish 1" />
                    </div>
                    <div>
                        <img src={pppImage} alt="Delicious dish 2" />
                    </div>
                    <div>
                        <img src={downloadImage1} alt="Delicious dish 3" />
                    </div>
                    <div>
                        <img src={downloadImage2} alt="Delicious dish 4" />
                    </div>
                </Slider>
            </div>
        </section>
    );
}

export default Dashboard;
