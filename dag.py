#!/usr/bin/env python
"""Poor man task dependency maps as Sankey diagrams"""

from pathlib import Path

import bottle

HOST = '0.0.0.0'
PORT = '8080'
WEB_FOLDER = "web"

def main():
    """The main function... I know, shocker, right!?"""

    dest = (Path(__file__).parent / WEB_FOLDER).resolve()
    print(f"Serving files from {dest}")

    @bottle.route('/')
    def serve_index():
        return bottle.static_file('index.html', root=dest)

    bottle.run(host=HOST, port=PORT)

if __name__ == '__main__':
    main()
