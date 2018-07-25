# Error code reference

This is a list of error codes within the application, with information on their possible origin et cetera. It's always a good idea to consult the error and error message for more information on the source of the problem. This list only govern the location of the error code emissions within the application.

| Code | Reason(s) | Origin(s) |
| ---- | --------- | --------- |
| Ghost | An unexpected HTTP request error occurred during login or auth status checking. | api.js, L26 and L59 |
| Orphan | The WebSocket server is no longer sending heartbeats, or the client is not receiving them. | Dashboard.jsx, L84 |
| Curtain | The client failed to reconnect to the WebSocket server. | Dashboard.jsx, L125 |
