import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Icon } from "@iconify/react";

const CallToAction = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 4,
        borderRadius: 3,
        maxWidth: '40vw',
        margin: "auto",
        boxShadow: 4,
        background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
        transition: "0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary">
        Ready to Get Started?
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
        With an account you will receive:
      </Typography>

      <List sx={{ textAlign: "left", display: "inline-block", mt: 2 }}>
        {[
          { icon: "material-symbols:storage", text: "Storage for all your SlideWonder data" },
          { icon: "material-symbols:security", text: "Secure data access" },
          { icon: "material-symbols:cloud-sync", text: "Asynchronous cloud synchronization" },
        ].map((item, index) => (
          <ListItem style={{maxHeight:'4vh'}} key={index}>
            <ListItemIcon>
              <Icon icon={item.icon} color="green" width="24" height="24" />
            </ListItemIcon>
            <ListItemText style={{color:'black'}} primary={item.text} />
          </ListItem>
        ))}
      </List>

      
    </Box>
  );
};

export default CallToAction;
