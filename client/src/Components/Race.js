import React, {useState, useEffect} from 'react';
import {Container, Row} from "react-bootstrap";
import Flight from "./Flight";
import SenderConnection from '../webrtc/SenderConnection';
import ReceiverConnection, { ON_MESSAGE_EVENT_NAME } from '../webrtc/ReceiverConnection';

function Race(props) {
    const {alice, bob, isMatchingUp, id} = props;
    useEffect(() => {
        if (!isMatchingUp) {
            console.log("Setting up connection at", new Date());
            if (alice === id) {
                const connection = new SenderConnection(id, bob);
                connection.sendMessage("Hello from Race component!");
            } else {
                const connection = new ReceiverConnection(id, alice);
                connection.listener.addEventListener(ON_MESSAGE_EVENT_NAME, ({detail: message}) => {
                    console.log('Message received in component:', message, new Date());
                });
            }
        }
    }, [isMatchingUp]);

    if (!isMatchingUp) {
        return (
            <Container>
                <Row className={'player-flights'}>
                    <Flight self={true}/>
                    <Flight/>
                </Row>
                <Row>
                    <p className={'reference-text'}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
                        et
                        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip
                        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                        officia
                        deserunt mollit anim id est laborum
                    </p>
                </Row>
                <Row>
                    <input className={'user-race-input'} type={'text'}/>
                </Row>
            </Container>
        );
    } else {
        return <p>Finding an opponent for you...</p>
    }
}

export default Race;