# Event reference

This is a list of the events that can be emitted within the application, along with information on their purpose.

| Event | Description | Parameters | Type |
| ----- | ----------- | ---------- | ---- |
| TOGGLE_THEME | Toggle between the light and dark theme. | None | None |
| LOGIN_SUCCESS | Authentication in the backend has succeeded. | Username | String |
| LOGOUT | Commence logout procedure and terminate session. | None | None |
| REQUEST_ERROR_OVERLAY | Display an error overlay. Use only for errors that the application cannot proceed without. | err, msg, code | Object<String> |
