from genlayer import *

class TestDoc(gl.Contract):
    def __init__(self):
        pass

    @gl.public.view
    def get_help(self) -> str:
        import pydoc
        return pydoc.render_doc(gl.eq_principle_prompt_comparative)
