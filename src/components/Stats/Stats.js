import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Icon } from '@iconify/react';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = ({ slides }) => {
  const [typeCounts, setTypeCounts] = useState({});
  const [deckRanges, setDeckRanges] = useState([]);
  const [slideDensityRanges, setSlideDensityRanges] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('types'); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && Array.isArray(slides) && slides.length > 0) {
      // Count the types of slide elements
      const countTypes = (slides) => {
        const typeCounts = {};
        slides.forEach((slideObj) => {
          if (Array.isArray(slideObj.deck)) {
            slideObj.deck.forEach((slide) => {
              if (Array.isArray(slide.content)) {
                slide.content.forEach((item) => {
                  const { type } = item;
                  typeCounts[type] = (typeCounts[type] || 0) + 1;
                });
              }
            });
          }
        });
        return typeCounts;
      };
      setTypeCounts(countTypes(slides));

      // Deck length analysis
      const lengths = slides.map((slideObj) => slideObj.deck.length);
      const maxLength = Math.max(...lengths);
      const rangeSize = 5;
      const ranges = [{ range: `0-5`, frequency: 0 }];
      for (let i = rangeSize + 1; i <= maxLength; i += rangeSize) {
        ranges.push({ range: `${i}-${i + rangeSize - 1}`, frequency: 0 });
      }
      lengths.forEach((length) => {
        const rangeIndex = Math.floor(length / rangeSize);
        if (rangeIndex < ranges.length) {
          ranges[rangeIndex].frequency += 1;
        }
      });
      const nonZeroRanges = ranges.filter(range => range.frequency > 0);
      setDeckRanges(nonZeroRanges);

      // Slide density analysis 
      const densities = slides.flatMap((slideObj) => 
        slideObj.deck.map((slide) => slide.content ? slide.content.length : 0)
      );
      const maxDensity = Math.max(...densities);
      const densityRanges = [{ range: `0-5`, frequency: 0 }];
      for (let i = 6; i <= maxDensity; i += 5) {
        densityRanges.push({ range: `${i}-${i + 4}`, frequency: 0 });
      }
      densities.forEach((density) => {
        const rangeIndex = Math.floor(density / 5);
        if (rangeIndex < densityRanges.length) {
          densityRanges[rangeIndex].frequency += 1;
        }
      });
      const nonZeroDensityRanges = densityRanges.filter(range => range.frequency > 0);
      setSlideDensityRanges(nonZeroDensityRanges);
    }
  }, [slides, isClient]);

  if (!isClient || slides.length === 0) {
    return null;
  }

  const rows = Object.keys(typeCounts).map((type) => ({
    type,
    frequency: typeCounts[type],
  }));

  const chartDataTypes = {
    labels: rows.map(row => row.type),
    datasets: [
      {
        label: 'Frequency of Types',
        data: rows.map(row => row.frequency),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartDataDeck = {
    labels: deckRanges.map(range => range.range),
    datasets: [
      {
        label: 'Deck Length Frequency',
        data: deckRanges.map(range => range.frequency),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartDataDensity = {
    labels: slideDensityRanges.map(range => range.range),
    datasets: [
      {
        label: 'Slide Density Frequency',
        data: slideDensityRanges.map(range => range.frequency),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };


const chartDensityOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          return `Frequency: ${tooltipItem.raw}`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Items Per Slide', 
      },
    },
    y: {
      title: {
        display: true,
        text: 'Slide Amount', 
      },
      ticks: {
        beginAtZero: true,
      },
    },
  },
};


  const chartHeight = window.innerHeight * 0.6;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
<Button onClick={() => setActiveTab('types')}  sx={{ backgroundColor: activeTab === 'types' ? 'grey.300' : 'transparent', '& .MuiButton-startIcon': { color: activeTab === 'types' ? 'primary.main' : 'text.primary' } }}>Slide Elements <Icon icon="fluent-mdl2:shape-solid" /></Button>
<Button onClick={() => setActiveTab('deck')}  sx={{ backgroundColor: activeTab === 'deck' ? 'grey.300' : 'transparent', '& .MuiButton-startIcon': { color: activeTab === 'deck' ? 'primary.main' : 'text.primary' } }}>Deck Lengths <Icon icon="material-symbols:trail-length" /></Button>
<Button onClick={() => setActiveTab('density')}sx={{backgroundColor: activeTab === 'density' ? 'grey.300' : 'transparent', '& .MuiButton-startIcon': { color: activeTab === 'density' ? 'primary.main' : 'text.primary' } }}>Slide Density <Icon icon="fluent:slide-layout-20-filled" /></Button>

      </div>
      <div style={{ height: '60vh' }}>
        {activeTab === 'types' && (
          <div style={{ marginTop: '20px' }}>
            <h2>Slide Elements</h2>
            <Bar data={chartDataTypes} options={{ responsive: true, }}height={chartHeight} />
          </div>
        )}
        {activeTab === 'deck' && (
          <div style={{ marginTop: '20px' }}>
            <h2>Deck Lengths</h2>
            <Bar data={chartDataDeck} options={{ responsive: true }} height={chartHeight}/>
          </div>
        )}
        {activeTab === 'density' && (
          <div style={{ marginTop: '20px' }}>
            <h2>Slide Density</h2>
            <Bar data={chartDataDensity} options={chartDensityOptions}height={chartHeight}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
