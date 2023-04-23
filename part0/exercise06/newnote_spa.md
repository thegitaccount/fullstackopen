sequenceDiagram
    participant browser
    participant server

    Note right of browser: browser sends newly added note to new_note_spa in json form

    browser->>server: https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: server answers with status code 201
