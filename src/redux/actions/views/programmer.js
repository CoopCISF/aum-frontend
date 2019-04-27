export const PROGRAMMER_ACTION_TYPE = {
    ADD_ELEMENT_REQUEST: "PROGRAMMER_ADD_ELEMENT_REQUEST",
    ADD_ELEMENT_SUCCESSFUL: "PROGRAMMER_ADD_ELEMENT_SUCCESSFUL",
    ADD_ELEMENT_FAILED: "PROGRAMMER_ADD_ELEMENT_FAILED",
    GET_ALL_REQUEST: "PROGRAMMER_GET_ALL_REQUEST",
    GET_ALL_SUCCESSFUL: "PROGRAMMER_GET_ALL_SUCCESSFUL",
    GET_ALL_FAILED: "PROGRAMMER_GET_ALL_FAILED",
    RESET_UI_STATE: "RESET_UI_STATE"
}

export function addElement(elementType, payload) {
    return {
        type: PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_REQUEST,
        elementType,
        payload
    }
}

export function getAll(elementType) {
    return {
        type: PROGRAMMER_ACTION_TYPE.GET_ALL_REQUEST,
        elementType
    }
}

export function resetUiState() {
    return {
        type: PROGRAMMER_ACTION_TYPE.RESET_UI_STATE
    }
}