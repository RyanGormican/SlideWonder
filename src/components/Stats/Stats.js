import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Stats = ({ slides }) => {
  const [typeCounts, setTypeCounts] = useState({});
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
    }
  }, [slides, isClient]);

  if (!isClient) {
    return null;  
  }

  const rows = Object.keys(typeCounts).map((type) => ({
    type,
    frequency: typeCounts[type],
  }));

  return (
  <TableContainer component={Paper}>
    {rows.length === 0 ? (
      <p>Need more slide data to generate a table.</p>
    ) : (
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>
        <h1> Slide Elements </h1>
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
);

};

export default Stats;
