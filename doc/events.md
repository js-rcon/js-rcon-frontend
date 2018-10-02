# Event reference

This is a list of the events that can be emitted within the application, along with information on their purpose.

| Event | Description | Parameters | Type |
| ----- | ----------- | ---------- | ---- |
| TOGGLE_THEME | Toggle between the light and dark theme. | enabled | Boolean |
| TOGGLE_AUTOPROTECT | Toggle automatic kicking of private/new users. | enabled | Boolean |
| LOGIN_SUCCESS | Authentication in the backend has succeeded. | Username | String |
| LOGOUT | Commence logout procedure and terminate session. | None | None |
| LOGOUT_SIGNAL | Emitted to the dashboard to redirect the user back to the login screen. | None | None |
| REQUEST_ERROR_OVERLAY | Display an error overlay. Use only for errors that the application cannot proceed without. | err, msg, code | Object<String> |
| OPEN_SETTINGS | Open the settings dialog. | None | None |
| OPEN_DEBUG | Open the debug dialog if running in development. | None | None |
| RECEIVED_SERVER_RESPONSE | Informs viewer components that a reply was received from the server. Used to decide whether **OPEN_RESPONSE_VIEWER** or **DISPLAY_RESPONSE_TOAST** is emitted. | response | Object<op: String, c: Any, id: String\> |
| OPEN_RESPONSE_VIEWER | Open the server response viewer. Used by tools that return long responses. | response | Object<c: Any, id: String\> |
| DISPLAY_RESPONSE_TOAST | Display a toast with the server response. Used by tools that return short responses. | response | Object<c: Any, id: String\> |
| RECEIVED_MAPS | Informs that the server map list has been received and written to storage. | None | None |
| RECEIVED_PLAYERS | Informs that the server player list has been received and written to storage. Accompanied by changes in connections. | connectionChanges | Object<Array> |
| DISPLAY_NOTIFICATION | Display a generic notification. | data | String |
| TOGGLE_LICENSES | Toggle between the license and about view in the about overlay. | None | None |
| TOGGLE_SIDEBAR | Toggle the sidebar menu. | None | None |
| REQUEST_VIEW_CHANGE | Emitted when a sidebar menu item is clicked and a new view needs to be rendered | requestedView | String |
| REVERT_SETTINGS | Emitted when there has been some form of settings malfunction and settings have been reset. This event is used to communicate the change to the settings overlay to prevent inaccurate info being displayed. | None | None |
