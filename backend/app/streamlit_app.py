import streamlit as st
import os
import sys
from ui_strings import UI_STRINGS
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.config import load_config
from src.rag_system import ArabicRAGSystem

os.environ["OPENAI_API_KEY"] = "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"
os.environ["GOOGLE_API_KEY"] = "AIzaSyCS1BffW1boMTsHsg5tW_LJRIErIWxJ0EI"

def init_session_state():
    """Initialize session state variables."""
    if 'rag_system' not in st.session_state:
        config = load_config()
        st.session_state.rag_system = ArabicRAGSystem(config)
    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    if 'language' not in st.session_state:
        st.session_state.language = 'ar'

def get_string(key: str) -> str:
    """Get UI string in current language."""
    return UI_STRINGS[st.session_state.language][key]

def main():
    """Main Streamlit application."""
    st.set_page_config(page_title="Arabic Document Q&A", layout="wide")
    init_session_state()
    
    # Language selector
    language = st.selectbox(
        "Language/اللغة",
        options=['en', 'ar'],
        index=0 if st.session_state.language == 'en' else 1
    )
    if language != st.session_state.language:
        st.session_state.language = language
    
    st.title(get_string("title"))
    
    # Query interface
    with st.container():
        query = st.text_input(
            "",
            placeholder=get_string("query_placeholder")
        )
        
        if st.button(get_string("submit_button")):
            try:
                with st.spinner(get_string("processing")):
                    response = st.session_state.rag_system.query(
                        query,
                        st.session_state.chat_history
                    )
                
                # Display answer
                st.subheader(get_string("answer_header"))
                st.write(response["answer"])
                
                # Display sources
                st.subheader(get_string("sources_header"))
                for i, doc in enumerate(response["source_documents"], 1):
                    with st.expander(f"Source {i}"):
                        st.write(doc.page_content)
                
                # Update chat history
                st.session_state.chat_history.append((query, response["answer"]))
                
            except Exception as e:
                st.error(f"{get_string('error_query')}: {str(e)}")

if __name__ == "__main__":
    main()
