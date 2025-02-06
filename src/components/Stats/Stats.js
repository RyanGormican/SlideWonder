import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Stats = ({ slides }) => {
  const [typeCounts, setTypeCounts] = useState({});
  const [deckRanges, setDeckRanges] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

 useEffect(() => {
  if (isClient && Array.isArray(slides) && slides.length > 0) {
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

    const lengths = slides.map((slideObj) => slideObj.deck.length);
    const maxLength = Math.max(...lengths);
    const rangeSize = 5;
    const ranges = [];

    ranges.push({
      range: `0-5`,
      frequency: 0,
    });

  
    for (let i = rangeSize + 1; i <= maxLength; i += rangeSize) {
      ranges.push({
        range: `${i}-${i + rangeSize - 1}`,
        frequency: 0,
      });
    }

    lengths.forEach((length) => {
      const rangeIndex = Math.floor(length / rangeSize);
      if (rangeIndex < ranges.length) {
        ranges[rangeIndex].frequency += 1;
      }
    });

    // Filter out ranges with zero frequency
    const nonZeroRanges = ranges.filter(range => range.frequency > 0);
    setDeckRanges(nonZeroRanges);
  }
}, [slides, isClient]);



  if (!isClient || slides.length === 0) {
    return null;  
  }

  const rows = Object.keys(typeCounts).map((type) => ({
    type,
    frequency: typeCounts[type],
  }));
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>


      <TableContainer component={Paper} style={{ flex: 1, marginRight: '10px' }}>
        {rows.length === 0 ? (
          <p>Need more slide data to generate a table.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h1>Slide Elements</h1>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.type}
                  </TableCell>
                  <TableCell align="right">{row.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TableContainer component={Paper} style={{ flex: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <h1>Deck Lengths</h1>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Range</TableCell>
              <TableCell align="right">Frequency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deckRanges.map((range, index) => (
              <TableRow key={index}>
                <TableCell>{range.range}</TableCell>
                <TableCell align="right">{range.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Stats;
