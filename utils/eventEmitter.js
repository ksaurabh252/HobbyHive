const EventEmitter = require("events");

class HobbyHiveEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase if needed
  }
}

const emitter = new HobbyHiveEmitter();

// Event listeners
emitter.on("resourceAdded", (resource) => {
  console.log(`New resource added: ${resource.title}`);
  // Future: Add notification logic here
});

emitter.on("error", (err) => {
  console.error("Event emitter error:", err);
});

module.exports = emitter;
