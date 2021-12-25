import React, {useState, useEffect} from 'react';
import {Container, Row} from "react-bootstrap";
import Flight from "./Flight";
import SocketConnection from '../util/SocketConnection';

function Race(props) {
    const {alice, bob, isMatchingUp, id} = props;
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (!isMatchingUp) {
            if (alice === id) {
                setConnection(new SocketConnection(id, bob));
            } else {
                setConnection(new SocketConnection(id, alice));
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