import React, { useState } from "react";
import { Box, IconButton, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Icon } from "@iconify/react";
import * as SelectUtility from './SelectUtility';

const Notifications = ({ slides, setNotifications, notifications }) => {
  const [hoveredNotification, setHoveredNotification] = useState(null);

  const notificationslist = slides.flatMap((slide) => [
    {
      type: 'created',
      title: slide.title,
      timestamp: slide.dateCreated,
    },
    {
      type: 'updated',
      title: slide.title,
      timestamp: slide.lastUpdated,
    }
  ]);

  const sortedNotifications = notificationslist.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={{
      position: 'fixed',
      right: '0px',
      top: '0px',
      height: "100vh",
      width: "10vw",
      zIndex: "5",
      border: "1px solid #ddd",
      backgroundColor: 'white',
      borderRadius: "8px",
      padding: "0.5rem",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', paddingBottom: '0.5rem' }}>
        <Typography variant="h6" style={{
          fontWeight: "bold",
          marginBottom: "16px",
          color:'black',
        }}>
          Slide Notification Logs
          <IconButton 
            onClick={() => setNotifications(!notifications)} 
            style={{
              marginLeft: "8px",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Icon icon="material-symbols:notifications"/>
          </IconButton>
        </Typography>
      </div>

      <List style={{ maxHeight: "calc(100vh - 10rem)", overflowY: "auto" }}>
        {sortedNotifications.map((notification, index) => {
          const isHovered = hoveredNotification === index;

          return (
            <ListItem 
              key={index} 
              style={{
                paddingLeft: 0, 
                paddingRight: 0, 
                borderBottom: "1px solid #ddd",  
                borderRadius: "4px",
                marginBottom: "8px",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={() => setHoveredNotification(index)}
              onMouseOut={() => setHoveredNotification(null)}
            >
              <ListItemText
                primary={`${notification.title} was ${notification.type}  `}
                secondary={
                  <span 
                    style={{ color:'black', cursor: "pointer" }}
                  >
                    {isHovered ? SelectUtility.formatDate(notification.timestamp) : SelectUtility.timeAgo(notification.timestamp)}
                  </span>
                }
                style={{color:'black'}}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Notifications;
