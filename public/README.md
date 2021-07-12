# JS239 - Final Project (Todo App)

## Assumptions

- I tried to mimic the live app whenever I encountered something that wasn't explicitly noted in the project requirements.
- User is alerted on both failed requests and response statuses defined as errors in the docs. 
  - Failed requests try to reload the page.  Tested by making API request after server was stopped, goal was to show browser's generic "failed to connect page" if can't recover by reloading.
- Year Dropdown starts in 2021 as opposed to 2014 as in the live app.
- For click on individual todo items (deleting item and toggling complete status):
  - if either of these events is triggered they can't be triggered again until the page reloads (limit API calls from spamming clicks).
  - Toggling complete status by clicking the item toggles the CSS selector and then makes API call.  My computer is slow so i did this for aesthetics, otherwise the delay was unpleasant.  Now the CSS changes, and then the item gets resorted within the list (if required).
- Deleting a todo triggers a check to see if there are any todos left.  If there are no todos left, the DB resets to restart id at 1.

## 
