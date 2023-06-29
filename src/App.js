import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Carousel from "react-bootstrap/Carousel";
import Col from "react-bootstrap/Col";

function App() {
	const [value, setValue] = useState("");
	const [messages, setMessages] = useState(null);
	const [images, setImages] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleKeyDown = async (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			getRecipes();
		}
	};

	const getRecipes = async () => {
		setValue("");
		setIsLoading(true);
		setImages(null);
		const options = {
			method: "POST",
			body: JSON.stringify({
				message: value,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			const response = await fetch(
				"http://localhost:5000/api/chatgpt",
				options
			);
			const data = await response.json();
			setMessages(data);
			const imgResponse = await fetch("http://localhost:5000/api/image", {
				method: "POST",
				body: JSON.stringify({
					dish_name: data.map((dish) => dish.dish_name),
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const imgData = await imgResponse.json();
			setImages(imgData);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
			setError(error);
		}
	};

	return (
		<Container
			fluid
			style={{
				backgroundColor: "gray",
				minHeight: "calc(100vh - 80px)",
			}}
		>
			<>
				<h1 className="title">Recipe App</h1>
				<Form className="main-input">
					<Form.Group className="input-container">
						<input
							type="text"
							value={value}
							placeholder="Enter ingredients you have to get 5 recipes"
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={handleKeyDown}
							className="form-input"
						></input>
						<div
							className="btn-submit"
							onClick={getRecipes}
							onKeyDown={handleKeyDown}
						>
							<AiOutlineSearch />
						</div>
					</Form.Group>
				</Form>
				{isLoading ? (
					<div className="main-input">
						<p>Please be patient. The server is slow...It is loading...</p>
					</div>
				) : null}
				{error ? (
					<div className="main-input">
						<p>Error occurred. please try refresh and type ingredients again</p>
						<p>{error}</p>
					</div>
				) : null}
				{messages && images ? (
					<div>
						<Carousel>
							{messages?.map((message, messageIndex) => (
								<Carousel.Item key={messageIndex}>
									<Row>
										<Col className="col-carousel">
											<Card
												style={{
													maxWidth: "650px",
													backgroundColor: "#acaaa7",
													margin: "20px",
												}}
												sm={4}
												md={6}
												lg={8}
											>
												<div className="title-card">
													<Card.Title>{message.dish_name}</Card.Title>
													{message.dish_type ? (
														<Card.Text>{message.dish_type}</Card.Text>
													) : null}
												</div>
												<Card.Img
													variant="top"
													src={images ? images[messageIndex].url : null}
													className="recipe-image"
												/>

												<Card.Body
													style={{
														backgroundColor: "#f3f0ee",
														borderRadius: "10px",
														display: "flex",
														flexDirection: "column",
														justifyContent: "space-between",
													}}
												>
													<div className="body-container">
														<div className="nav-main">
															<div>
																{message.cooking_time ? (
																	<Card.Text>
																		Cooking Time: {message.cooking_time}
																	</Card.Text>
																) : null}
															</div>
															<div>
																{message.prepping_time ? (
																	<Card.Text>
																		Prep Time: {message.prepping_time}
																	</Card.Text>
																) : null}
															</div>
															<div>
																{message.servings ? (
																	<Card.Text>
																		Servings: {message.servings}
																	</Card.Text>
																) : null}
															</div>
														</div>
														<div className="card-main">
															<div className="card-left">
																<Card.Title className="card-main-title">
																	INGREDIENTS
																</Card.Title>
																<Card.Text>
																	{message.ingredients?.map((ing, index) => (
																		<li key={index}>
																			{index + 1}. {ing}
																		</li>
																	))}
																</Card.Text>
															</div>
															<div className="card-right">
																<Card.Title className="card-main-title">
																	DIRECTIONS
																</Card.Title>
																<Card.Text>
																	{message.cooking_directions?.map(
																		(dir, index) => (
																			<li key={index}>
																				{index + 1}. {dir}
																			</li>
																		)
																	)}
																</Card.Text>
															</div>
														</div>
													</div>
													<div>
														{message.notes ? (
															<div>
																<div className="card-bottom">
																	<Card.Title>NOTES</Card.Title>
																	<Card.Text>{message.notes}</Card.Text>
																</div>
															</div>
														) : null}
													</div>
												</Card.Body>
											</Card>
										</Col>
									</Row>
								</Carousel.Item>
							))}
						</Carousel>
					</div>
				) : null}
			</>
		</Container>
	);
}

export default App;
