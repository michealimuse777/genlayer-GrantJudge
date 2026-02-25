# { "Depends": "py-genlayer:test" }
from genlayer import *

class WebTest(gl.Contract):
    result: str

    def __init__(self):
        self.result = ""

    @gl.public.write
    def fetch_test(self) -> str:
        def do_fetch() -> str:
            # Simple test: fetch a public API that returns deterministic JSON
            page = gl.get_webpage("https://jsonplaceholder.typicode.com/todos/1", mode="text")
            return page

        output = gl.eq_principle.strict_eq(do_fetch)
        self.result = output
        return output

    @gl.public.view
    def get_result(self) -> str:
        return self.result
