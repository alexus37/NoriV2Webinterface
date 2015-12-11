#!/usr/bin/env python3
import os
from swampdragon.swampdragon_server import run_server

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "noriv2apiserver.settings")

run_server()
