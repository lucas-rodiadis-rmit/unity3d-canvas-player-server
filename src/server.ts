import app from "./app";
import config from "./appConfig";

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
});
