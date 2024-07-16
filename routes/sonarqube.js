const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv').config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

router.post('/', (req, res) => {
  const sonarqubePayload = req.body;

  // Extract necessary data
  const { serverUrl, project, qualityGate, analysedAt, status } = sonarqubePayload;
  const { conditions } = qualityGate;
  const color = qualityGate.status === 'OK' ? '#ff7b7b' : '#008080';
  

  // Format the payload for Slack
  const slackPayload = {
    blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${qualityGate.status === 'OK' ? '✅' : '❌'} SonarQube Analysis for ${project.name} - ${qualityGate.status}`,
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Project:* ${project.name}`
            },
            {
              type: "mrkdwn",
              text: `*Status:* ${qualityGate.status}`
            },
            {
              type: "mrkdwn",
              text: `*Analyzed At:* ${new Date(analysedAt).toLocaleString()}`
            },
            {
              type: "mrkdwn",
              text: `*Project URL:* <${project.url}|${project.name}>`
            },
            {
              type: "mrkdwn",
              text: `*Server URL:* <${serverUrl}|SonarQube>`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Quality Gate Conditions:*"
          }
        },
        ...conditions.map(condition => ({
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Metric:* ${condition.metric}`
            },
            {
              type: "mrkdwn",
              text: `*Status:* ${condition.status}`
            },
            {
              type: "mrkdwn",
              text: `*Operator:* ${condition.operator}`
            },
            {
              type: "mrkdwn",
              text: `*Value:* ${condition.value || 'N/A'}`
            },
            {
              type: "mrkdwn",
              text: `*Error Threshold:* ${condition.errorThreshold}`
            }
          ]
        }))
      ]
  };

  // Send the reformatted payload to Slack
  axios.post(SLACK_WEBHOOK_URL, slackPayload)
    .then(response => {
      res.status(200).send('Notification sent to Slack');
    })
    .catch(error => {
      console.error('Error sending notification to Slack:', error);
      res.status(500).send('Error sending notification to Slack');
    });
});

module.exports = router;

