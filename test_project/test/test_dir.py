def test_genlayer_dir():
    import genlayer as gl
    print("DIR of gl:")
    print(dir(gl))
    try:
        print("DOC of eq_principle_prompt_comparative:")
        print(gl.eq_principle_prompt_comparative.__doc__)
    except Exception as e:
        print(e)
