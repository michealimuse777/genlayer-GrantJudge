# { "Depends": "py-genlayer:test" }
import json
from genlayer import *

class Inspector(gl.Contract):
    def __init__(self):
        pass

    @gl.public.write
    def test_comparative(self) -> str:
        def get_eval() -> str:
            result = gl.exec_prompt("Say exactly: hello world")
            return str(result)
        
        try:
            val = gl.eq_principle.prompt_comparative(get_eval, "The outputs are equivalent if they both say hello world")
            return "SUCCESS: " + str(val)
        except Exception as e:
            return "ERROR: " + str(e)
