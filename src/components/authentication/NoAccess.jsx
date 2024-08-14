import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import noAccess from '../../images/noaccess.jpg'

const NoAccess = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Row className="text-center">
                <Col>
                    <img
                        src={noAccess}
                        alt="No Access"
                        className=" mb-4"
                        height={'250px'}
                    
                    />
                    
                    <h5 className="mb-4 text-danger" >
                        You do not have permission to view this page.
                    </h5>
                    <Button variant="danger" onClick={handleGoBack}>
                        Go Back
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NoAccess;
