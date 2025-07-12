### Movement
- [x] Basic movements (left, right, jump, friction)
- [x] Basic gravity
- [ ] Variable jump height (e.g. short-tap vs hold)
- [ ] Prevent out-of-bounds movement or implement screen wrapping

---

### Collisions
- [x] Obstacle collisions

---

### WebSockets & Networking
- [x] Players can see each other and move
- [ ] Ping/pong latency measurement
- [ ] Connection recovery / reconnection logic
- [x] Efficient state diffing (send only changed state)
- [ ] Lobby

---

### Client-Side Reconciliation
- [ ] Apply local input prediction
- [ ] Timestamped inputs for correction
- [ ] Server reconciliation 
- [ ] Rollback system

---

### Obstacles & Level Design
- [x] Add static obstacle support
- [ ] Level loader from JSON / Tiled format
- [ ] Platform types (solid, passthrough, bouncy, etc.)
- [ ] Level builder

---

### Visuals
- [ ] Simple animation (e.g. walking frames)
- [ ] Idle state visuals
- [ ] Jumping/falling visuals
- [ ] Player name tag or health bar

---

### Audio (Optional)
- [ ] Jump / land sounds
- [ ] Collision sounds
- [ ] Background music

---

### Debug & Tools
- [ ] Hitbox/physics debug overlay
- [ ] FPS and ping display
- [x] Logging toggle (client/server)

---

### Polish & UX
- [ ] Responsive canvas resizing
- [ ] Input remapping
