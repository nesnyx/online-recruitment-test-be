import { eventBus } from "../../../utils/event-bus";

eventBus.on("admin.send-invitation", async (payload) => {
    console.log("Received admin.send-invitation event with payload:", payload);
});