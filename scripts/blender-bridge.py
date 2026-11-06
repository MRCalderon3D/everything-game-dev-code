"""Minimal client for the Blender MCP add-on socket (no MCP server needed).

The `blender-mcp` add-on (https://github.com/ahujasid/blender-mcp) listens on
localhost:9876 and accepts JSON commands. The usual MCP server package cannot be
installed on networks that block files.pythonhosted.org, so this script talks to
the add-on directly using only the standard library.

Usage:
    python scripts/blender-bridge.py info                    # scene summary
    python scripts/blender-bridge.py run  script.py          # execute a Python file inside Blender
    python scripts/blender-bridge.py cmd  <type> [json]      # any add-on command, e.g.
        cmd get_object_info '{"name": "Cube"}'
        cmd get_viewport_screenshot '{"max_size": 1024, "filepath": "C:/tmp/shot.png"}'

Security: the add-on executes whatever code it receives. Only start it in
Blender while you are working with it, and stop it afterwards.
"""
import json
import socket
import sys

HOST, PORT = "127.0.0.1", 9876


def send(command_type, params=None, timeout=600.0):
    with socket.create_connection((HOST, PORT), timeout=timeout) as sock:
        sock.sendall(json.dumps({"type": command_type, "params": params or {}}).encode("utf-8"))
        buffer = b""
        while True:
            chunk = sock.recv(65536)
            if not chunk:
                break
            buffer += chunk
            try:
                return json.loads(buffer.decode("utf-8"))
            except json.JSONDecodeError:
                continue  # response not complete yet
    raise ConnectionError("Blender closed the connection without a complete response")


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    action = argv[1]
    if action == "info":
        response = send("get_scene_info")
    elif action == "run":
        with open(argv[2], encoding="utf-8") as source:
            response = send("execute_code", {"code": source.read()})
    elif action == "cmd":
        params = json.loads(argv[3]) if len(argv) > 3 else {}
        response = send(argv[2], params)
    else:
        print(__doc__)
        return 2
    print(json.dumps(response, indent=2, ensure_ascii=False))
    return 0 if response.get("status") == "success" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
