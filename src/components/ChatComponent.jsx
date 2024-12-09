import React, {useEffect} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";

const ChatComponent = (chatMessages=[],
                       onChange,
                       value,
                       onClick) => {


    return (
        <div className={"chat-container"}>
            <Container>
                {chatMessages.map((chatMessage, messageIndex) => (
                    <Row key={messageIndex}>
                        <Col xs={2}>{chatMessage.from}: </Col>
                        <Col>{chatMessage.content}</Col>
                    </Row>))}
            </Container>
            <div className={"chat-controls"}>
                <Form.Control as="textarea"
                              placeholder={"write message here..."}
                              onChange={onChange}
                              value={value}/>
                <Button disabled={value.length === 0} onClick={onClick}>Send</Button>
            </div>
        </div>
    )
}

ChatComponent.propTypes = {
    chatMessages: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
export default ChatComponent