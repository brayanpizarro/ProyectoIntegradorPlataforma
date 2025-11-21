import { useState, useCallback } from 'react';

export interface Tab {
  id: string;
  title: string;
  type: 'note' | 'data';
  content?: any;
  isActive: boolean;
}

export interface WorkspaceState {
  leftTabs: Tab[];
  rightTabs: Tab[];
  splitView: boolean;
  activePanel: 'left' | 'right';
}

/**
 * Custom hook for managing workspace tabs
 * Handles tab creation, closing, focusing, and split view
 */
export const useWorkspaceTabs = () => {
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    leftTabs: [],
    rightTabs: [],
    splitView: false,
    activePanel: 'left'
  });

  const openTab = useCallback((sectionId: string, sectionTitle: string, type: 'note' | 'data') => {
    const tabId = `tab-${sectionId}`;
    
    setWorkspace(prev => {
      // Check if tab already exists
      const existsInLeft = prev.leftTabs.some(tab => tab.id === tabId);
      const existsInRight = prev.rightTabs.some(tab => tab.id === tabId);
      
      if (existsInLeft || existsInRight) {
        // If exists, activate it
        return {
          ...prev,
          leftTabs: existsInLeft ? 
            prev.leftTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
            prev.leftTabs,
          rightTabs: existsInRight ? 
            prev.rightTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
            prev.rightTabs,
          activePanel: existsInLeft ? 'left' : 'right'
        };
      }
      
      // Create new tab
      const newTab: Tab = {
        id: tabId,
        title: sectionTitle,
        type,
        isActive: true,
        content: type === 'note' ? { notes: [], newNote: '' } : null
      };
      
      const targetPanel = prev.activePanel;
      
      return {
        ...prev,
        [targetPanel === 'left' ? 'leftTabs' : 'rightTabs']: [
          ...prev[targetPanel === 'left' ? 'leftTabs' : 'rightTabs'].map(tab => ({ ...tab, isActive: false })),
          newTab
        ]
      };
    });
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setWorkspace(prev => ({
      ...prev,
      leftTabs: prev.leftTabs.filter(tab => tab.id !== tabId),
      rightTabs: prev.rightTabs.filter(tab => tab.id !== tabId)
    }));
  }, []);

  const focusTab = useCallback((tabId: string) => {
    setWorkspace(prev => {
      const isInLeft = prev.leftTabs.some(tab => tab.id === tabId);
      const isInRight = prev.rightTabs.some(tab => tab.id === tabId);
      
      return {
        ...prev,
        leftTabs: isInLeft ? 
          prev.leftTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
          prev.leftTabs,
        rightTabs: isInRight ? 
          prev.rightTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
          prev.rightTabs,
        activePanel: isInLeft ? 'left' : 'right'
      };
    });
  }, []);

  const enableSplitView = useCallback(() => {
    setWorkspace(prev => ({ ...prev, splitView: true }));
  }, []);

  const disableSplitView = useCallback(() => {
    setWorkspace(prev => ({
      ...prev,
      splitView: false,
      leftTabs: [...prev.leftTabs, ...prev.rightTabs],
      rightTabs: []
    }));
  }, []);

  const setActivePanel = useCallback((panel: 'left' | 'right') => {
    setWorkspace(prev => ({ ...prev, activePanel: panel }));
  }, []);

  return {
    workspace,
    openTab,
    closeTab,
    focusTab,
    enableSplitView,
    disableSplitView,
    setActivePanel
  };
};
